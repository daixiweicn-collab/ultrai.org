// 从官方 MCP Registry 抓取全部最新版本的 MCP 服务器，计算"UltrAI 信任分"，生成 src/data/mcp.json
// 用法：node scripts/fetch-mcp.mjs [最大页数]
import { writeFile, mkdir } from 'node:fs/promises';

const OUT = new URL('../src/data/mcp.json', import.meta.url);
const BASE = 'https://registry.modelcontextprotocol.io/v0/servers';
const MAX_PAGES = Number(process.argv[2] || 2000);
const META = 'io.modelcontextprotocol.registry/official';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getPage(cursor, attempt = 0) {
  const url = new URL(BASE);
  url.searchParams.set('limit', '100');
  url.searchParams.set('version', 'latest');
  if (cursor) url.searchParams.set('cursor', cursor);
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'UltrAI.org data bot (+https://ultrai.org)' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    if (attempt >= 4) throw e;
    await sleep(1000 * 2 ** attempt);
    return getPage(cursor, attempt + 1);
  }
}

const slugify = (name) => name.replace(/[/]/g, '--').replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();

// 透明、可解释的启发式评分（不是安全审计）
function trust(s, meta) {
  const reasons = [];
  let score = 0;
  const repo = s.repository?.url || '';
  if (/github\.com|gitlab\.com|codeberg\.org/.test(repo)) { score += 25; reasons.push('source'); }
  if (s.websiteUrl) { score += 10; reasons.push('website'); }
  // 命名空间：io.github.* 表示 GitHub 账号验证，其它反向域名表示通过 DNS/HTTP 验证域名所有权
  if (!s.name.startsWith('io.github.')) { score += 15; reasons.push('domain'); } else { score += 8; reasons.push('github-ns'); }
  if ((s.description || '').length >= 40) { score += 10; reasons.push('docs'); }
  const pk = s.packages || [];
  if (pk.some((p) => ['npm', 'pypi', 'oci', 'nuget'].includes(p.registryType))) { score += 10; reasons.push('package'); }
  if ((s.remotes || []).some((r) => (r.url || '').startsWith('https://'))) { score += 10; reasons.push('https'); }
  const updated = meta?.updatedAt ? new Date(meta.updatedAt) : null;
  if (updated) {
    const days = (Date.now() - updated.getTime()) / 864e5;
    if (days < 90) { score += 15; reasons.push('fresh'); } else if (days < 365) { score += 8; reasons.push('recent'); }
  }
  if (/^\d+\.\d+\.\d+/.test(s.version || '') && !/^0\.0\./.test(s.version)) { score += 5; reasons.push('semver'); }
  return { score: Math.min(100, score), reasons };
}

function category(text) {
  const t = text.toLowerCase();
  const rules = [
    ['dev', /github|git\b|code|developer|ide|lint|test|ci\b|deploy|docker|kubernetes|terminal|api docs|sdk/],
    ['data', /database|sql|postgres|mysql|mongo|redis|supabase|bigquery|snowflake|analytics|data warehouse|vector/],
    ['search', /search|crawl|scrap|web page|browser|fetch/],
    ['ai', /llm|model|image gen|video|audio|speech|tts|embedding|agent|prompt/],
    ['productivity', /notion|calendar|email|gmail|slack|docs|sheet|task|todo|jira|linear|meeting|note/],
    ['business', /crm|sales|marketing|seo|ads|shopify|ecommerce|stripe|payment|invoice|hubspot|lead/],
    ['finance', /finance|stock|crypto|trading|bank|market data|accounting|tax/],
    ['cloud', /aws|azure|gcp|cloudflare|vercel|server|infrastructure|monitor|observab|log/],
    ['security', /security|vulnerab|auth|identity|compliance|threat|scan/],
    ['knowledge', /wiki|knowledge|rag|memory|document|pdf|research|paper/],
  ];
  for (const [k, re] of rules) if (re.test(t)) return k;
  return 'other';
}

async function main() {
  const all = new Map();
  let cursor = null;
  for (let i = 0; i < MAX_PAGES; i++) {
    const page = await getPage(cursor);
    for (const item of page.servers || []) {
      const s = item.server;
      const meta = item._meta?.[META];
      if (meta?.status && meta.status !== 'active') continue;
      const t = trust(s, meta);
      const desc = (s.description || '').trim();
      all.set(s.name, {
        name: s.name,
        slug: slugify(s.name),
        title: s.title || s.name.split('/').pop(),
        description: desc.slice(0, 400),
        version: s.version || '',
        repo: s.repository?.url || null,
        website: s.websiteUrl || null,
        remote: (s.remotes || []).map((r) => ({ type: r.type, url: r.url })).slice(0, 3),
        packages: (s.packages || []).map((p) => ({ type: p.registryType, id: p.identifier, transport: p.transport?.type })).slice(0, 3),
        published: meta?.publishedAt?.slice(0, 10) || null,
        updated: meta?.updatedAt?.slice(0, 10) || null,
        category: category(`${s.name} ${s.title || ''} ${desc}`),
        trust: t.score,
        signals: t.reasons,
      });
    }
    cursor = page.metadata?.nextCursor;
    if ((i + 1) % 20 === 0) console.log(`page ${i + 1}, servers ${all.size}`);
    if (!cursor) break;
    await sleep(150);
  }
  const servers = [...all.values()].sort((a, b) => b.trust - a.trust || (b.updated || '').localeCompare(a.updated || '') || a.name.localeCompare(b.name));
  const categories = {};
  for (const s of servers) categories[s.category] = (categories[s.category] || 0) + 1;

  // 精选前 1000 个高质量服务器用于静态站构建（避免仓库膨胀和构建超时），完整总数保留用于展示
  const topServers = servers.slice(0, 1000);
  const topSlugs = new Set(topServers.slice(0, 500).map((s) => s.slug));
  const searchIndex = servers.slice(0, 5000).map((s) => ({
    n: s.name,
    s: s.slug,
    t: s.title,
    d: s.description.slice(0, 160),
    c: s.category,
    r: s.trust,
    u: s.updated,
    p: topSlugs.has(s.slug) ? 1 : 0,
    w: s.website || s.repo || '',
  }));

  const updated = new Date().toISOString();
  await mkdir(new URL('../src/data/', import.meta.url), { recursive: true });
  await mkdir(new URL('../public/data/', import.meta.url), { recursive: true });
  await writeFile(
    OUT,
    JSON.stringify({ updated, source: 'Official MCP Registry', totalCount: servers.length, count: topServers.length, categories, servers: topServers })
  );
  await writeFile(
    new URL('../public/data/mcp-search.json', import.meta.url),
    JSON.stringify({ updated, totalCount: servers.length, count: searchIndex.length, items: searchIndex })
  );
  console.log(`mcp servers: ${servers.length} total, ${topServers.length} curated, ${searchIndex.length} in search index`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

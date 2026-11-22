// 从 OpenRouter 公开 API 抓取模型目录与价格，生成 src/data/models.json
// 用法：node scripts/fetch-models.mjs
import { writeFile, mkdir } from 'node:fs/promises';

const OUT = new URL('../src/data/models.json', import.meta.url);
const API = 'https://openrouter.ai/api/v1/models';

const perM = (v) => {
  const n = Number(v);
  if (!isFinite(n) || n < 0) return null; // 负数表示"可变价格"，视为无
  return Math.round(n * 1e6 * 10000) / 10000; // 转为 美元/百万 token
};

const slugify = (id) => id.replace(/[/:]/g, '--').replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();

async function main() {
  const res = await fetch(API, { headers: { 'User-Agent': 'UltrAI.org data bot (+https://ultrai.org)' } });
  if (!res.ok) throw new Error(`OpenRouter HTTP ${res.status}`);
  const { data } = await res.json();

  const models = data
    .map((m) => {
      const p = m.pricing || {};
      const [providerId] = m.id.split('/');
      const name = (m.name || m.id).replace(/^[^:]+:\s*/, ''); // 去掉 "OpenAI: " 前缀
      const provider = (m.name || '').includes(':') ? m.name.split(':')[0].trim() : providerId;
      const input = perM(p.prompt);
      const output = perM(p.completion);
      return {
        id: m.id,
        slug: slugify(m.id),
        name,
        provider,
        providerId,
        description: (m.description || '').slice(0, 600),
        created: m.created ? new Date(m.created * 1000).toISOString().slice(0, 10) : null,
        context: m.context_length || m.top_provider?.context_length || null,
        maxOutput: m.top_provider?.max_completion_tokens || null,
        input,
        output,
        cacheRead: perM(p.input_cache_read),
        free: input === 0 && output === 0,
        inputModalities: m.architecture?.input_modalities || [],
        outputModalities: m.architecture?.output_modalities || [],
        tools: (m.supported_parameters || []).includes('tools'),
        structured: (m.supported_parameters || []).includes('structured_outputs') || (m.supported_parameters || []).includes('response_format'),
        reasoning: !!m.reasoning || (m.supported_parameters || []).includes('reasoning'),
        openWeights: !!m.hugging_face_id,
        hf: m.hugging_face_id || null,
      };
    })
    .filter((m) => m.input !== null && m.output !== null);

  await mkdir(new URL('../src/data/', import.meta.url), { recursive: true });
  await writeFile(
    OUT,
    JSON.stringify({ updated: new Date().toISOString(), source: 'OpenRouter public models API', count: models.length, models }, null, 0)
  );
  console.log(`models: ${models.length} saved`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

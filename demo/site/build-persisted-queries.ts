import fastGlob from 'fast-glob';
import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';

const inputGlob = 'src/**/*.{ts,tsx}';
const outputPath = 'src/queryMap.generated.ts';

async function main() {
  const files = await fastGlob([inputGlob], {
    ignore: ['**/*.d.ts', 'node_modules/**'],
  });

  const queryMap: Record<string, string> = {};

  for (const filePath of files) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const gqlRegex = /gql`([\s\S]*?)`/g;
    let match;
    while ((match = gqlRegex.exec(fileContent)) !== null) {
      const query = match[1].trim();
      const hash = createHash('sha256').update(query).digest('hex');
      queryMap[hash] = query;
    }
  }

  const out = `// 🔒 Auto-generated — DO NOT EDIT
export const queryMap = ${JSON.stringify(queryMap, null, 2)} as const;\n`;

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, out, 'utf-8');

  console.log(`✅ Persisted queries written to ${outputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

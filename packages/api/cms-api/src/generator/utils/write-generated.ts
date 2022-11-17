import { ESLint } from "eslint";
import { promises as fs } from "fs";
import * as path from "path";

export async function writeGenerated(filePath: string, contents: string): Promise<void> {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    const eslint = new ESLint({
        cwd: process.cwd(),
        fix: true,
    });
    const lintResult = await eslint.lintText(contents, {
        filePath,
    });

    const output = lintResult[0] && lintResult[0].output ? lintResult[0].output : lintResult[0].source;
    await fs.writeFile(filePath, output ?? contents);
    console.log(`generated ${filePath}`);
}

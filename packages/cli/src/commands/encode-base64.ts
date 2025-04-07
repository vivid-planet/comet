/* eslint-disable no-console */
import { Command } from "commander";
import fs from "fs";
import { resolve } from "path";

export const encodeBase64Command = new Command("encode-base64")
    .description("Encode masked parts of a file to base64")
    .requiredOption("-i, --in-file <file>", "The filename of a template file to inject.")
    .requiredOption("-o, --out-file <file>", "Write the injected template to a file.")
    .action(async (options) => {
        console.log(`encode-base64: ${options.inFile}`);

        let str = fs.readFileSync(resolve(process.cwd(), options.inFile)).toString();
        str = str.replace(/\[\[ base64:\/\/(.*) \]\]/g, (_match, toEncode) => Buffer.from(toEncode).toString("base64"));
        fs.writeFileSync(resolve(process.cwd(), options.outFile), str);
    });

import fs from "fs";

interface ContentData {
    textContents: {
        [key: string]: string;
    };
}

const exportJSONFile = process.argv[2];
const pageTree = fs.readFileSync(exportJSONFile, "utf8");
const data: ContentData = JSON.parse(pageTree);
const text: string[] = [];

Object.keys(data.textContents).map((content) => {
    text.push(`msgid ${JSON.stringify(content)}`);
});

fs.writeFile(
    "./export.po",
    `msgid ""\nmsgstr ""\n"Content-Type: text/plain; charset=UTF-8"\n\n${text.join('\nmsgstr ""\n\n')}\nmsgstr ""`,
    (err: unknown) => {
        if (err) {
            console.error(err);
        }
    },
);

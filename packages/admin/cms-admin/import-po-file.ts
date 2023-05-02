import fs from "fs";

interface ContentData {
    [key: string]: string;
}

const poFile = process.argv[2];
const content: ContentData = {};

const fileContent = fs.readFileSync(poFile, "utf8");

let contentLines = fileContent.replace(/\\"/g, '"').split("\n");
contentLines = contentLines.splice(4, contentLines.length - 1); // To remove po file header

let readingMsgid = false;
let readingMsgstr = false;

let currentMsgid = "";
let currentMsgstr = "";

contentLines.forEach((contentLine, index) => {
    if (contentLine === "" && readingMsgstr && contentLines[index - 1].endsWith('"')) {
        readingMsgstr = false;

        content[currentMsgid.slice(0, -1)] = currentMsgstr.slice(0, -1);

        currentMsgid = "";
        currentMsgstr = "";
        return;
    }

    if (contentLine.startsWith("msgid")) {
        readingMsgid = true;

        currentMsgid += contentLine.slice(7);

        return;
    } else if (contentLine.startsWith("msgstr")) {
        readingMsgstr = true;
        readingMsgid = false;

        currentMsgstr += contentLine.slice(8);

        if (index === contentLines.length - 1) {
            content[currentMsgid.slice(0, -1)] = currentMsgstr.slice(0, -1);
        }

        return;
    } else {
        if (readingMsgid) {
            currentMsgid += `\n${contentLine}`;
        } else if (readingMsgstr) {
            currentMsgstr += `\n${contentLine}`;
        }
    }
});

fs.writeFile("./content.json", JSON.stringify({ textContents: content }), (err: unknown) => {
    if (err) {
        console.error(err);
    }
});

import { parse } from "papaparse";

const convertCsvToTextContents = (csv: string) => {
    const content: { [key: string]: string } = {};
    const parsedData = parse(csv).data as string[][];
    const records = parsedData.slice(1, parsedData.length);

    records.forEach((record) => (content[encodeContent(record[0])] = encodeContent(record[1])));

    return { textContents: content };
};

export { convertCsvToTextContents };

/* 
    parses HTML/XML entities in text content into special characters
*/
function encodeContent(text: string): string {
    return text.split("&amp;").join("&").split("&lt;").join("<").split("&gt;").join(">").split("&nbsp;").join(" ").split("<br>\n").join(`\n`);
}

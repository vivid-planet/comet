import { parse } from "papaparse";

const convertCsvToTextContents = (csv: string) => {
    const content: { [key: string]: string } = {};
    const parsedData = parse(csv).data as string[][];
    const records = parsedData.slice(1, parsedData.length);

    records.forEach((record) => (content[record[0]] = record[1]));

    return { textContents: content };
};

export { convertCsvToTextContents };

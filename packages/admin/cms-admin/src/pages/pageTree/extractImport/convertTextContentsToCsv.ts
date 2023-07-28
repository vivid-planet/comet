import { unparse } from "papaparse";

const convertTextContentsToCsv = (contents: string[]) => {
    const data = contents.map((content) => ({ original: content, replaceWith: content }));

    return unparse(data, { quotes: true, delimiter: ";" });
};

export { convertTextContentsToCsv };

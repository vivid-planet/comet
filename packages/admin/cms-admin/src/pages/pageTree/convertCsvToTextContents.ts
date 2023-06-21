const convertCsvToTextContents = (csv: string) => {
    const content: { [key: string]: string } = {};

    const lines = csv.replace("//r/g", "").split("\n");

    for (let i = 1; i < lines.length; i++) {
        const lineContent = lines[i].split(";");

        content[lineContent[0]] = lineContent[1];
    }

    return { textContents: content };
};

export { convertCsvToTextContents };

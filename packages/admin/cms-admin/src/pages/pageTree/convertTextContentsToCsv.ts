const convertTextContentsToCsv = (contents: string[]) => {
    const rows = ["Original;ReplaceWith"];

    contents.forEach((content) => {
        let value = content.replace(/"/g, '""');

        if (content.includes(";")) {
            value = `"${value}"`;
        }
        rows.push(`${value};${value}`);
    });
    return rows.join("\n");
};

export { convertTextContentsToCsv };

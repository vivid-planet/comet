const convertTextContentsToCsv = (contents: string[]) => {
    const rows = ["Original;ReplaceWith"];

    contents.forEach((content) => {
        const value = content.replace(/;/g, '"";""');
        rows.push(`${value};${value}`);
    });
    return rows.join("\n");
};

export { convertTextContentsToCsv };

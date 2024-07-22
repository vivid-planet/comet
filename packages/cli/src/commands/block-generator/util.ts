export const getCamelCaseName = (name: string) => {
    return name.replace(/\s/g, "").replace(/^./, (str) => str.toLowerCase());
};

export const getPascalCaseName = (name: string) => {
    return getCamelCaseName(name).replace(/^./, (str) => str.toUpperCase());
};

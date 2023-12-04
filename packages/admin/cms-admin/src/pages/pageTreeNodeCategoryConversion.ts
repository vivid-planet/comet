function categoryToUrlParam<T extends string = string>(category: T): string {
    // https://medium.com/@mattkenefick/snippets-in-javascript-converting-pascalcase-to-kebab-case-426c80672abc#828e
    return category.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();
}

function urlParamToCategory<T extends string = string>(param: string | undefined): T | undefined {
    // https://stackoverflow.com/a/54651317
    return param?.replace(/(^\w|-\w)/g, (text) => text.replace(/-/, "").toUpperCase()) as T | undefined;
}

export { categoryToUrlParam, urlParamToCategory };

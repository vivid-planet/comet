import { Transform } from "jscodeshift";

const renameMap: { [key: string]: string } = {
    "@comet/blocks-api": "@comet/api-blocks",
    "@comet/cms-api": "@comet/api-cms",
    "@comet/blocks-admin": "@comet/admin-blocks",
    "@comet/cms-admin": "@comet/admin-cms",
    "@comet/cms-site": "@comet/site-cms",
};

const transform: Transform = (file, api) => {
    const j = api.jscodeshift;

    // Convert the entire file source into a collection of nodes paths.
    const root = j(file.source);

    root.find(j.ImportDeclaration).forEach((imp) => {
        const source = imp.value.source.value as string;
        const key = Object.keys(renameMap).find((key) => source.startsWith(key));
        if (key) {
            imp.value.source.value = renameMap[key];
        }
    });

    return root.toSource();
};

export default transform;

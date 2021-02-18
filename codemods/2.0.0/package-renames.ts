import { Transform } from "jscodeshift";

const packageRenameMap: { [key: string]: string } = {
    "@comet/admin-date-picker": "@comet/admin-date-time",
};

const transform: Transform = (file, api) => {
    const j = api.jscodeshift;

    // Convert the entire file source into a collection of nodes paths.
    const root = j(file.source);

    root.find(j.ImportDeclaration).forEach((imp) => {
        const source = imp.value.source.value as string;
        const key = Object.keys(packageRenameMap).find((key) => source.startsWith(key));
        if (key) {
            imp.value.source.value = packageRenameMap[key];
        }
    });

    return root.toSource();
};

export default transform;

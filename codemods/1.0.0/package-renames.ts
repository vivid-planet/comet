import { Transform } from "jscodeshift";

const renameMap: { [key: string]: string } = {
    "@vivid-planet/react-admin-core": "@vivid-planet/comet-admin",
    "@vivid-planet/fetch-provider": "@vivid-planet/comet-admin",
    "@vivid-planet/file-icons": "@vivid-planet/comet-admin",
    "@vivid-planet/react-admin-final-form-material-ui": "@vivid-planet/comet-admin",
    "@vivid-planet/react-admin-form": "@vivid-planet/comet-admin",
    "@vivid-planet/react-admin-layout": "@vivid-planet/comet-admin",
    "@vivid-planet/react-select": "@vivid-planet/comet-admin-react-select",
    "@vivid-planet/react-admin-date-picker": "@vivid-planet/comet-admin-date-picker",
    "@vivid-planet/react-admin-color-picker": "@vivid-planet/comet-admin-color-picker",
    "@vivid-planet/react-admin-rte": "@vivid-planet/comet-admin-rte",
};

const transform: Transform = (file, api, options) => {
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

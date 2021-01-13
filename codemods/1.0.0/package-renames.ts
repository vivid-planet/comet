import { Transform } from "jscodeshift";

const renameMap: { [key: string]: string } = {
    "@vivid-planet/react-admin-core": "@comet/admin",
    "@vivid-planet/fetch-provider": "@comet/admin",
    "@vivid-planet/file-icons": "@comet/admin",
    "@vivid-planet/react-admin-final-form-material-ui": "@comet/admin",
    "@vivid-planet/react-admin-form": "@comet/admin",
    "@vivid-planet/react-admin-layout": "@comet/admin",
    "@vivid-planet/react-select": "@comet/admin-react-select",
    "@vivid-planet/react-admin-date-picker": "@comet/admin-date-picker",
    "@vivid-planet/react-admin-color-picker": "@comet/admin-color-picker",
    "@vivid-planet/react-admin-rte": "@comet/admin-rte",
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

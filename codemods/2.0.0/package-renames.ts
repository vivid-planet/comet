import { Transform } from "jscodeshift";

const transform: Transform = (file, api, options) => {
    const j = api.jscodeshift;

    // Convert the entire file source into a collection of nodes paths.
    const root = j(file.source);

    root.find(j.ImportDeclaration).forEach((imp) => {
        const source = imp.value.source.value as string;
        if (source === "@comet/admin" || source.startsWith("@comet/admin/lib")) {
            imp.value.source.value = source.replace("@comet/admin", "@comet/admin-core");
        }
    });

    return root.toSource();
};

export default transform;

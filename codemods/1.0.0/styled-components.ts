import { Transform } from "jscodeshift";

const transform: Transform = (file, api, options) => {
    const j = api.jscodeshift;

    // Convert the entire file source into a collection of nodes paths.
    const root = j(file.source);

    const importsToInsert = [];
    root.find(j.ImportDeclaration, { source: { value: "@vivid-planet/react-admin-mui" } }).forEach((imp) => {
        imp.value.specifiers.forEach((specifier) => {
            const name = specifier.local.name;
            if (name === "styled") {
                importsToInsert.push(j.importDefaultSpecifier(j.identifier("styled")));
            } else if (name === "css") {
                importsToInsert.push(j.importSpecifier(j.identifier("css")));
            }
        });
    });

    const removedImports = root.find(j.ImportDeclaration, { source: { value: "@vivid-planet/react-admin-mui" } }).remove();
    if (removedImports.length > 0) {
        root.find(j.Declaration)
            .at(0)
            .insertBefore(j.importDeclaration(importsToInsert, j.stringLiteral("styled-components"), "value"));
    }

    return root.toSource();
};

export default transform;

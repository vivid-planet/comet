import { Transform } from "jscodeshift";

const transform: Transform = (file, api) => {
    const j = api.jscodeshift;

    // Convert the entire file source into a collection of nodes paths.
    const root = j(file.source);

    // Update imports
    // import styled from "styled-components"; -> import { styled } from "@mui/material/styles";
    // import { css, keyframes } from "styled-components"; -> import { css, keyframes } from "@mui/material";
    let hasDefaultStyledImport = false;
    const otherStyledImports = [];

    root.find(j.ImportDeclaration, { source: { value: "styled-components" } }).forEach((imp) => {
        imp.value.specifiers.forEach((specifier) => {
            const name = specifier.local.name;
            if (name === "styled") {
                hasDefaultStyledImport = true;
            } else if (name === "css" || name === "keyframes") {
                otherStyledImports.push(j.importSpecifier(j.identifier(name)));
            }
        });
    });

    root.find(j.ImportDeclaration, { source: { value: "styled-components" } }).remove();

    if (hasDefaultStyledImport) {
        root.find(j.Declaration)
            .at(0)
            .insertBefore(j.importDeclaration([j.importSpecifier(j.identifier("styled"))], j.stringLiteral("@mui/material/styles"), "value"));
    }

    if (otherStyledImports.length > 0) {
        const hasMuiImport = root.find(j.ImportDeclaration, { source: { value: "@mui/material" } }).length > 0;

        if (hasMuiImport) {
            root.find(j.ImportDeclaration, { source: { value: "@mui/material" } }).forEach((imp) => {
                j(imp).replaceWith(j.importDeclaration([...imp.value.specifiers, ...otherStyledImports], imp.value.source));
            });
        } else {
            root.find(j.Declaration)
                .at(0)
                .insertBefore(j.importDeclaration(otherStyledImports, j.stringLiteral("@mui/material"), "value"));
        }
    }

    // Update style definitions
    // const A = styled.div``; -> const A = styled("div")``;
    root.find(j.TaggedTemplateExpression).forEach((path) => {
        const { tag } = path.value;
        if (
            tag.type === "MemberExpression" &&
            tag.object.type === "Identifier" &&
            tag.object.name === "styled" &&
            tag.property.type === "Identifier"
        ) {
            const htmlTag = tag.property.name;

            j(path)
                .find(j.MemberExpression)
                .replaceWith(j.callExpression(j.identifier("styled"), [j.literal(htmlTag)]));
        }
    });

    return root.toSource();
};

export default transform;

import { Transform } from "jscodeshift";
/*
 * What does this codeMod:
 *
 *      showBackButton codeMods:
 *          - Add <StackBackButton/> to all Stacks that have showBackButton={true} prop
 *          - Add StackBackButton specifier to @comet/admin import
 *
 * */

const transform: Transform = (file, api, options) => {
    const j = api.jscodeshift;

    // Convert the entire file source into a collection of nodes paths.
    const root = j(file.source);

    let addedBackButtonComponent = false;
    root.findJSXElements("Stack").map((astElement) => {
        astElement.value.openingElement.attributes.forEach((attribute) => {
            if (attribute.name.name === "showBackButton" && attribute.value.expression.value === true) {
                addedBackButtonComponent = true;
                // Add <StackBackButton /> as first child to <Stack>
                const openingElement = j.jsxOpeningElement(j.jsxIdentifier("StackBackButton"), [], true);
                astElement.value.children = [openingElement].concat(astElement.value.children);
            }
        });

        // Remove showBackButton prop from jsx element
        astElement.value.openingElement.attributes = astElement.value.openingElement.attributes.filter((attribute) => {
            return attribute.name.name !== "showBackButton";
        });
    });

    // Add StackBackButton Component to @comet/admin import
    if (addedBackButtonComponent) {
        root.find(j.Declaration).forEach((declaration) => {
            if (declaration.value.source?.value === "@comet/admin") {
                const found = j.importDeclaration.from(declaration.value).specifiers.find((specifier) => {
                    return specifier?.local?.name === "StackBackButton";
                });

                if (!found) {
                    declaration.value = j.importDeclaration
                        .from(declaration.value)
                        .specifiers.push(j.importSpecifier(j.identifier("StackBackButton")));
                }
            }
        });
    }

    return root.toSource();
};

export default transform;

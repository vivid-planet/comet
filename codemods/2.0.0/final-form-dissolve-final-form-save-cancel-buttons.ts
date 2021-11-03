import { Transform } from "jscodeshift";
/*
 * What does this codeMod:
 *
 *      handle deprecation of renderButtons of FinalFormProp:
 *          - Add <FinalFormSaveCancelButtonsLegacy/> to all FinalForm Components that have not set a renderButtons prop
 *
 * */

const transform: Transform = (file, api, options) => {
    const j = api.jscodeshift;

    const root = j(file.source);

    // Iterate all Stacks
    root.findJSXElements("FinalForm").map((astElement) => {
        let addFormButtons = true;
        // check if we have to add FormButtons
        astElement.value.openingElement?.attributes?.forEach((astAttribute) => {
            const attribute = j.jsxAttribute.from(astAttribute);
            if (attribute.name.name === "renderButtons") {
                addFormButtons = false;
                console.error(`⛔️\tError: \t\t${file.path} - Could not transform renderButtons - fix it manually`);
            } else if (attribute.name.name === "render") {
                addFormButtons = false;

                console.error(`⛔️\tError: \t\t${file.path} - Could not handle render method - fix it manually`);
            } else if (attribute.name.name === "components") {
                addFormButtons = false;

                console.error(`⛔️\tError: \t\t${file.path} - Could not handle components Prop - fix it manually`);
            }
        });

        // Add FinalFormSaveCancelButtonsLegacy to the end
        if (addFormButtons) {
            // Add <FinalFormSaveCancelButtonsLegacy /> as last child to <Stack>
            const openingElement = j.jsxOpeningElement(j.jsxIdentifier("FinalFormSaveCancelButtonsLegacy"), [], true);
            astElement.value.children = astElement.value.children.concat(openingElement);

            // Add FinalFormSaveCancelButtonsLegacy Component to @comet/admin import
            root.find(j.Declaration).forEach((declaration) => {
                if (declaration.value.source?.value === "@comet/admin") {
                    const found = j.importDeclaration.from(declaration.value).specifiers.find((specifier) => {
                        return specifier?.local?.name === "FinalFormSaveCancelButtonsLegacy";
                    });

                    if (!found) {
                        declaration.value = j.importDeclaration
                            .from(declaration.value)
                            .specifiers.push(j.importSpecifier(j.identifier("FinalFormSaveCancelButtonsLegacy")));
                    }
                }
            });
            console.log(`✅ \tProcessed: \t${file.path}`);
        }
    });

    return root.toSource();
};

export default transform;

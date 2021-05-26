import { Transform } from "jscodeshift";
/*
 * What does this codeMod:
 *
 *      showBreadcrumbs codeMods:
 *          - Add <StackBreadcrumbs/> to all Stacks that have no showBreadcrumbs prop
 *          - Add <StackBreadcrumbs/> to all Stacks that have showBreadcrumbs={true} prop
 *          - Add StackBreadcrumb specifier to @comet/admin import
 *
 * */

const transform: Transform = (file, api, options) => {
    const j = api.jscodeshift;

    const root = j(file.source);

    let addedBreadcrumbsComponent = false;

    // Iterate all Stacks
    root.findJSXElements("Stack").map((astElement) => {
        let addShowBreadcrumbs = true;

        // check if we have to add Breadcrumb Component later
        astElement.value.openingElement?.attributes?.forEach((astAttribute) => {
            const attribute = j.jsxAttribute.from(astAttribute);
            if (attribute.name.name === "showBreadcrumbs") {
                if (attribute?.value?.expression?.value === false) {
                    addShowBreadcrumbs = false;
                }
            }
        });

        // Add Stack Breadcrumb Component
        if (addShowBreadcrumbs) {
            addedBreadcrumbsComponent = true;
            // Add <StackBreadcrumbs /> as first child to <Stack>
            const openingElement = j.jsxOpeningElement(j.jsxIdentifier("StackBreadcrumbs"), [], true);
            astElement.value.children = [openingElement].concat(astElement.value.children);
        }

        // Remove showBreadcrumbs prop from jsx element
        astElement.value.openingElement.attributes = astElement.value.openingElement.attributes.filter((attribute) => {
            return attribute.name.name !== "showBreadcrumbs";
        });
    });

    // Add StackBreadcrumb Component to @comet/admin import
    if (addedBreadcrumbsComponent) {
        root.find(j.Declaration).forEach((declaration) => {
            if (declaration.value.source?.value === "@comet/admin") {
                const found = j.importDeclaration.from(declaration.value).specifiers.find((specifier) => {
                    return specifier?.local?.name === "StackBreadcrumbs";
                });

                if (!found) {
                    declaration.value = j.importDeclaration
                        .from(declaration.value)
                        .specifiers.push(j.importSpecifier(j.identifier("StackBreadcrumbs")));
                }
            }
        });
    }

    return root.toSource();
};

export default transform;

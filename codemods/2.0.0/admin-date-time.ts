import { Transform } from "jscodeshift";

const transform: Transform = (file, api) => {
    const j = api.jscodeshift;
    // Convert the entire file source into a collection of nodes paths.
    const root = j(file.source);

    const fieldComponents = root.find(j.JSXElement, {
        openingElement: { name: { name: "Field" } },
    });

    fieldComponents.forEach((path) => {
        let replaceClearButtonAttribute: boolean = false;

        path.value.openingElement.attributes.forEach((attribute) => {
            if (attribute.name.name === "component") {
                const componentName = attribute.value.expression.name;
                if (componentName === "FinalFormDatePicker" || componentName === "FinalFormDateRangePicker") {
                    replaceClearButtonAttribute = true;
                }
            }
        });

        if (replaceClearButtonAttribute) {
            path.value.openingElement.attributes
                .filter((attr) => {
                    const attributeName = attr.name.name;
                    return attributeName === "showClearDate" || attributeName === "showClearDates";
                })
                .forEach((item) => {
                    item.name.name = "showClearButton";
                });
        }
    });

    return root.toSource();
};

export default transform;

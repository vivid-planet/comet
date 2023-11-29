import { Transform } from "jscodeshift";

const renameMap = {
    Checkbox: "FinalFormCheckbox",
    Input: "FinalFormInput",
    Radio: "FinalFormRadio",
    Switch: "FinalFormSwitch",
    ReactSelect: "FinalFormReactSelect",
    ReactSelectAsync: "FinalFormReactSelectAsync",
    ReactSelectCreatable: "FinalFormReactSelectCreatable",
    ReactSelectAsyncCreateable: "FinalFormReactSelectAsyncCreateable",
    ReactSelectStaticOptions: "FinalFormReactSelectStaticOptions",
    TextField: "FinalFormTextField",
    ColorPicker: "FinalFormColorPicker",
    DatePicker: "FinalFormDatePicker",
    DateRangePicker: "FinalFormDateRangePicker",
    FileUpload: "FinalFormFileUpload",
};

const transform: Transform = (file, api, options) => {
    const j = api.jscodeshift;

    // Convert the entire file source into a collection of nodes paths.
    const root = j(file.source);

    for (const candidateElement of Object.keys(renameMap)) {
        const touched = {};
        root.findJSXElements(candidateElement).forEach((element, i) => {
            // Check if we can find an import from admin and rename that as well
            root.find(j.ImportDeclaration).forEach((imp) => {
                if (imp.value.source.value === "@comet/admin") {
                    imp.value.specifiers.forEach((specifier) => {
                        if (specifier.local.name === candidateElement) {
                            specifier.local.name = renameMap[candidateElement];
                            touched[candidateElement] = true;
                        }
                    });
                }
            });

            // if we found no import, it is probably not a elemnt w
            if (touched[candidateElement]) {
                element.value.openingElement.name.name = renameMap[candidateElement];
            }
        });
    }

    return root.toSource();
};

export default transform;

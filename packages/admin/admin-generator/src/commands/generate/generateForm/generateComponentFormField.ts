import { type ComponentFormFieldConfig } from "../generate-command.js";
import { convertConfigImport } from "../utils/convertConfigImport.js";
import { isGeneratorConfigImport } from "../utils/runtimeTypeGuards.js";
import { type GenerateFieldsReturn } from "./generateFields.js";

export function generateComponentFormField({ config }: { config: ComponentFormFieldConfig }): GenerateFieldsReturn {
    if (!isGeneratorConfigImport(config.component)) {
        throw new Error("config.component must be a GeneratorConfigImport");
    }
    const imports = [convertConfigImport(config.component)];
    const code = `<${config.component.name} />`;

    return {
        imports,
        formProps: [],
        hooksCode: "",
        formFragmentFields: [],
        formValuesConfig: [],
        finalFormConfig: undefined,
        code,
        gqlDocuments: {},
    };
}

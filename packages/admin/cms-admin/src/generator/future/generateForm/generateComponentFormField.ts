import { type ComponentFormFieldConfig } from "../generator";
import { type Imports } from "../utils/generateImportsCode";
import { type GenerateFieldsReturn } from "./generateFields";

export function generateComponentFormField({ config }: { config: ComponentFormFieldConfig }): GenerateFieldsReturn {
    const imports: Imports = [{ name: config.component.name, importPath: config.component.import }];
    const code = `<${config.component.name} />`;

    return {
        imports,
        hooksCode: "",
        formFragmentFields: [],
        formValueToGqlInputCode: "",
        formValuesConfig: [],
        finalFormConfig: undefined,
        code,
        gqlDocuments: {},
    };
}

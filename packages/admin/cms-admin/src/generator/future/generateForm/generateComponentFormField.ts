import { ComponentFormFieldConfig } from "../generator";
import { Imports } from "../utils/generateImportsCode";
import { GenerateFieldsReturn } from "./generateFields";

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

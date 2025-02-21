import { type ComponentFormFieldConfig } from "../generator";
import { convertConfigImport } from "../utils/convertConfigImport";
import { type GenerateFieldsReturn } from "./generateFields";

export function generateComponentFormField({ config }: { config: ComponentFormFieldConfig }): GenerateFieldsReturn {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const imports = [convertConfigImport(config.component as any)]; // TODO: improve typing, generator runtime vs. config mismatch
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

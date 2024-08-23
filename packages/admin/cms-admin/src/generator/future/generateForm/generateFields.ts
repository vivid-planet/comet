import { IntrospectionQuery } from "graphql";

import { Prop } from "../generateForm";
import { FormConfig, GeneratorReturn, isFormFieldConfig, isFormLayoutConfig } from "../generator";
import { Imports } from "../utils/generateImportsCode";
import { generateFormField } from "./generateFormField";
import { generateFormLayout } from "./generateFormLayout";

export type GenerateFieldsReturn = GeneratorReturn & {
    imports: Imports;
    hooksCode: string;
    formFragmentFields: string[];
    formValueToGqlInputCode: string;
    props: Prop[];
    formValuesConfig: {
        omitFromFragmentType?: string;
        destructFromFormValues?: string; // equals omitting from formValues copied directly to mutation-input
        typeCode?: string;
        initializationCode?: string;
        defaultInitializationCode?: string;
    }[];
};

export function generateFields({
    gqlIntrospection,
    baseOutputFilename,
    fields,
    formConfig,
}: {
    gqlIntrospection: IntrospectionQuery;
    baseOutputFilename: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fields: FormConfig<any>["fields"];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formConfig: FormConfig<any>;
}): GenerateFieldsReturn {
    const gqlDocuments: Record<string, string> = {};
    let hooksCode = "";
    let formValueToGqlInputCode = "";
    const formFragmentFields: string[] = [];
    const imports: Imports = [];
    const props: Prop[] = [];
    const formValuesConfig: GenerateFieldsReturn["formValuesConfig"] = [];

    const code = fields
        .map((field) => {
            let generated: GenerateFieldsReturn;
            if (isFormFieldConfig(field)) {
                generated = generateFormField({ gqlIntrospection, baseOutputFilename, config: field, formConfig });
            } else if (isFormLayoutConfig(field)) {
                generated = generateFormLayout({ gqlIntrospection, baseOutputFilename, config: field, formConfig });
            } else {
                throw new Error("Not supported config");
            }

            for (const name in generated.gqlDocuments) {
                gqlDocuments[name] = generated.gqlDocuments[name];
            }
            imports.push(...generated.imports);
            props.push(...generated.props);
            hooksCode += generated.hooksCode;
            formValueToGqlInputCode += generated.formValueToGqlInputCode;
            formFragmentFields.push(...generated.formFragmentFields);
            formValuesConfig.push(...generated.formValuesConfig);
            return generated.code;
        })
        .join("\n");

    return {
        code,
        props,
        hooksCode,
        formValueToGqlInputCode,
        formFragmentFields,
        gqlDocuments,
        imports,
        formValuesConfig,
    };
}

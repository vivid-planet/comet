import { IntrospectionQuery } from "graphql";

import { FormConfig, GeneratorReturn, isFormFieldConfig, isFormLayoutConfig } from "../generator";
import { Imports } from "../utils/generateImportsCode";
import { generateFormField } from "./generateFormField";
import { generateFormLayout } from "./generateFormLayout";

export type GenerateFieldsReturn = GeneratorReturn & {
    imports: Imports;
    hooksCode: string;
    formFragmentFields: string[];
    formValueToGqlInputCode: string;
    formValuesConfig: {
        omitFromFragmentType?: string;
        typeCode?: string;
        initializationCode?: string;
        defaultInitializationCode?: string;
    }[];
    finalFormConfig?: {
        subscription?: { values: boolean };
        renderProps?: { values?: boolean; form?: boolean };
    };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findFieldByName(name: string, fields: FormConfig<any>["fields"]): FormConfig<any>["fields"][0] | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return fields.reduce<FormConfig<any>["fields"][0] | undefined>((acc, field) => {
        return acc ? acc : field.name === name ? field : isFormLayoutConfig(field) ? findFieldByName(name, field.fields) : undefined;
    }, undefined);
}

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
    const formValuesConfig: GenerateFieldsReturn["formValuesConfig"] = [];
    const finalFormConfig = { subscription: { values: false }, renderProps: { values: false, form: false } };

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
            hooksCode += generated.hooksCode;
            formValueToGqlInputCode += generated.formValueToGqlInputCode;
            formFragmentFields.push(...generated.formFragmentFields);
            formValuesConfig.push(...generated.formValuesConfig);

            finalFormConfig.subscription.values = finalFormConfig.subscription.values || !!generated.finalFormConfig?.subscription?.values;
            finalFormConfig.renderProps.values = finalFormConfig.renderProps.values || !!generated.finalFormConfig?.renderProps?.values;
            finalFormConfig.renderProps.form = finalFormConfig.renderProps.form || !!generated.finalFormConfig?.renderProps?.form;

            return generated.code;
        })
        .join("\n");

    return {
        code,
        hooksCode,
        formValueToGqlInputCode,
        formFragmentFields,
        gqlDocuments,
        imports,
        formValuesConfig,
        finalFormConfig,
    };
}

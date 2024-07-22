import { IntrospectionQuery } from "graphql";

import { FormConfig, FormLayoutConfig } from "../generator";
import { Imports } from "../utils/generateImportsCode";
import { generateFields, GenerateFieldsReturn } from "./generateFields";

export function generateFormLayout({
    gqlIntrospection,
    baseOutputFilename,
    config,
    formConfig,
}: {
    gqlIntrospection: IntrospectionQuery;
    baseOutputFilename: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: FormLayoutConfig<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formConfig: FormConfig<any>;
}): GenerateFieldsReturn {
    const gqlType = formConfig.gqlType;
    const instanceGqlType = gqlType[0].toLowerCase() + gqlType.substring(1);

    let code = "";
    let hooksCode = "";
    let formValueToGqlInputCode = "";
    const formFragmentFields: string[] = [];
    const gqlDocuments: Record<string, string> = {};
    const imports: Imports = [];

    if (config.type === "fieldSet") {
        const generatedFields = generateFields({ gqlIntrospection, baseOutputFilename, fields: config.fields, formConfig });
        hooksCode += generatedFields.hooksCode;
        formValueToGqlInputCode += generatedFields.formValueToGqlInputCode;
        formFragmentFields.push(...generatedFields.formFragmentFields);
        for (const name in generatedFields.gqlDocuments) {
            gqlDocuments[name] = generatedFields.gqlDocuments[name];
        }
        imports.push(...generatedFields.imports);

        imports.push({ name: "FieldSet", importPath: "@comet/admin" });
        const supportPlaceholder = config.supportText?.includes("{");
        if (supportPlaceholder) {
            imports.push({ name: "FormSpy", importPath: "react-final-form" });
        }
        code = `
        <FieldSet
            ${config.collapsible ? `collapsible` : ``}
            ${config.initiallyExpanded ? `initiallyExpanded` : ``}
            title={<FormattedMessage id="${instanceGqlType}.${config.name}.title" defaultMessage="${config.title}" />}
            ${
                config.supportText
                    ? `supportText={
                        ${supportPlaceholder ? `mode === "edit" && (<FormSpy subscription={{ values: true }}>{({ values }) => (` : ``}
                        <FormattedMessage
                            id="${instanceGqlType}.${config.name}.supportText"
                            defaultMessage="${config.supportText}"
                            ${supportPlaceholder ? `values={{ ...values }}` : ``}
                        />
                        ${supportPlaceholder ? `)}</FormSpy>)` : ``}
                    }`
                    : ``
            }
        >
            ${generatedFields.code}
        </FieldSet>`;
    } else {
        throw new Error(`Unsupported type`);
    }
    return {
        code,
        hooksCode,
        formValueToGqlInputCode,
        formFragmentFields,
        gqlDocuments,
        imports,
    };
}

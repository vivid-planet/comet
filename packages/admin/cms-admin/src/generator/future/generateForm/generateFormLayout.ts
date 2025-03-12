import { IntrospectionObjectType, IntrospectionQuery } from "graphql";

import { FormConfig, FormLayoutConfig } from "../generatorConfigs/formConfig";
import { camelCaseToHumanReadable } from "../utils/camelCaseToHumanReadable";
import { Imports } from "../utils/generateImportsCode";
import { generateFields, GenerateFieldsReturn } from "./generateFields";

export function generateFormLayout({
    gqlIntrospection,
    baseOutputFilename,
    config,
    formFragmentName,
    formConfig,
    gqlType,
    namePrefix,
}: {
    gqlIntrospection: IntrospectionQuery;
    baseOutputFilename: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: FormLayoutConfig<any>;
    formFragmentName: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formConfig: FormConfig<any>;
    gqlType: string;
    namePrefix?: string;
}): GenerateFieldsReturn {
    const rootGqlType = formConfig.gqlType;
    const formattedMessageRootId = rootGqlType[0].toLowerCase() + rootGqlType.substring(1);
    const dataRootName = rootGqlType[0].toLowerCase() + rootGqlType.substring(1); // TODO should probably be deteced via query

    let code = "";
    let hooksCode = "";
    let formValueToGqlInputCode = "";
    const formFragmentFields: string[] = [];
    const gqlDocuments: Record<string, string> = {};
    const imports: Imports = [];
    const formValuesConfig: GenerateFieldsReturn["formValuesConfig"] = [];
    const finalFormConfig = { subscription: {}, renderProps: {} };

    if (config.type === "fieldSet") {
        const title = config.title ?? camelCaseToHumanReadable(config.name);

        const generatedFields = generateFields({
            gqlIntrospection,
            baseOutputFilename,
            fields: config.fields,
            formFragmentName,
            formConfig,
            gqlType,
            namePrefix,
        });

        hooksCode += generatedFields.hooksCode;
        formValueToGqlInputCode += generatedFields.formValueToGqlInputCode;
        formFragmentFields.push(...generatedFields.formFragmentFields);
        for (const name in generatedFields.gqlDocuments) {
            gqlDocuments[name] = generatedFields.gqlDocuments[name];
        }
        imports.push(...generatedFields.imports);
        formValuesConfig.push(...generatedFields.formValuesConfig);

        finalFormConfig.subscription = { ...finalFormConfig.subscription, ...generatedFields.finalFormConfig?.subscription };
        finalFormConfig.renderProps = { ...finalFormConfig.renderProps, ...generatedFields.finalFormConfig?.renderProps };

        imports.push({ name: "FieldSet", importPath: "@comet/admin" });
        const supportPlaceholder = config.supportText?.includes("{");
        if (supportPlaceholder) {
            imports.push({ name: "FormSpy", importPath: "react-final-form" });
        }
        code = `
        <FieldSet
            ${config.collapsible === undefined || config.collapsible ? `collapsible` : ``}
            ${config.initiallyExpanded ? `initiallyExpanded` : ``}
            title={<FormattedMessage id="${formattedMessageRootId}.${config.name}.title" defaultMessage="${title}" />}
            ${
                config.supportText
                    ? `supportText={
                        ${supportPlaceholder ? `mode === "edit" && (<FormSpy subscription={{ values: true }}>{({ values }) => (` : ``}
                        <FormattedMessage
                            id="${formattedMessageRootId}.${config.name}.supportText"
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
    } else if (config.type === "optionalNestedFields") {
        const name = String(config.name);

        const introspectionObject = gqlIntrospection.__schema.types.find((type) => type.kind === "OBJECT" && type.name === gqlType) as
            | IntrospectionObjectType
            | undefined;
        if (!introspectionObject) throw new Error(`didn't find object ${gqlType} in gql introspection`);

        const introspectionField = introspectionObject.fields.find((field) => field.name === name);
        if (!introspectionField) throw new Error(`didn't find field ${name} in gql introspection type ${gqlType}`);
        if (introspectionField.type.kind === "NON_NULL") {
            throw new Error(`field ${name} in gql introspection type ${gqlType} must not be required to be usable with optionalNestedFields`);
        }
        if (introspectionField.type.kind !== "OBJECT") throw new Error(`field ${name} in gql introspection type ${gqlType} has to be OBJECT`);

        const checkboxLabel = config.checkboxLabel ?? `Enable ${camelCaseToHumanReadable(String(config.name))}`;

        const generatedFields = generateFields({
            gqlIntrospection,
            baseOutputFilename,
            fields: config.fields,
            formFragmentName,
            formConfig,
            gqlType: introspectionField.type.name,
            namePrefix: name,
        });
        hooksCode += generatedFields.hooksCode;
        formFragmentFields.push(`${name} { ${generatedFields.formFragmentFields.join(" ")} }`);
        for (const name in generatedFields.gqlDocuments) {
            gqlDocuments[name] = generatedFields.gqlDocuments[name];
        }
        imports.push(...generatedFields.imports);

        const wrappingFormValuesConfig: GenerateFieldsReturn["formValuesConfig"][0] = {
            omitFromFragmentType: name,
            destructFromFormValues: `${name}Enabled`,
            typeCode: `${name}Enabled: boolean;`,
            initializationCode: `${name}Enabled: !!data.${dataRootName}.${name}`,
        };
        const subfieldsFormValuesTypeCode = generatedFields.formValuesConfig
            .filter((config) => !!config.omitFromFragmentType)
            .map((config) => `"${config.omitFromFragmentType}"`);
        if (subfieldsFormValuesTypeCode.length) {
            wrappingFormValuesConfig.typeCode = `${wrappingFormValuesConfig.typeCode}
                ${name}: Omit<NonNullable<GQL${formFragmentName}Fragment["${name}"]>, ${subfieldsFormValuesTypeCode.join(" | ")}> & {
                    ${generatedFields.formValuesConfig.map((config) => config.typeCode).join("\n")}
                };`;
        }
        const subfieldsFormValuesInitCode = generatedFields.formValuesConfig
            .filter((config) => !!config.initializationCode)
            .map((config) => config.initializationCode);
        if (subfieldsFormValuesInitCode.length) {
            wrappingFormValuesConfig.initializationCode = `${wrappingFormValuesConfig.initializationCode},
                ${name}: data.${dataRootName}.${name} ? { ${subfieldsFormValuesInitCode.join(", ")}} : undefined    `;
        }
        const subfieldsFormValuesDefaultInitCode = generatedFields.formValuesConfig
            .filter((config) => !!config.defaultInitializationCode)
            .map((config) => config.defaultInitializationCode);
        if (subfieldsFormValuesDefaultInitCode.length) {
            wrappingFormValuesConfig.defaultInitializationCode = `${name}: { ${subfieldsFormValuesDefaultInitCode.join(", ")}}`;
        }
        formValuesConfig.push(wrappingFormValuesConfig);

        imports.push({ name: "FinalFormSwitch", importPath: "@comet/admin" });
        imports.push({ name: "messages", importPath: "@comet/admin" });
        imports.push({ name: "FormControlLabel", importPath: "@mui/material" });

        formValueToGqlInputCode += `${String(config.name)}: ${String(config.name)}Enabled && formValues.${String(config.name)} ? {${
            generatedFields.formValueToGqlInputCode
        }} : null,`;
        code = `<Field
                    fullWidth
                    name="${String(config.name)}Enabled"
                    type="checkbox"
                    label={<FormattedMessage id="${formattedMessageRootId}.${String(config.name)}.${String(
            config.name,
        )}Enabled" defaultMessage="${checkboxLabel}" />}
                >
                    {(props) => (
                        <FormControlLabel
                            control={<FinalFormSwitch {...props} />}
                            label={props.input.checked ? <FormattedMessage {...messages.yes} /> : <FormattedMessage {...messages.no} />}
                        />
                    )}
                </Field>
                 <Field name="${String(config.name)}Enabled" fullWidth subscription={{ value: true }}>
                    {({ input: { value } }) =>
                        value ? (
                            <>
                                ${generatedFields.code}
                            </>
                            ) : null
                    }
                </Field>`;
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
        formValuesConfig,
        finalFormConfig,
    };
}

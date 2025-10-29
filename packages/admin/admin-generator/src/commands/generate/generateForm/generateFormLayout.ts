import { type IntrospectionObjectType, type IntrospectionQuery } from "graphql";

import { type FormConfig, type FormLayoutConfig, type GQLDocumentConfigMap } from "../generate-command";
import { camelCaseToHumanReadable } from "../utils/camelCaseToHumanReadable";
import { type Imports } from "../utils/generateImportsCode";
import { generateFields, type GenerateFieldsReturn } from "./generateFields";
import { type Prop } from "./generateForm";

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
    const formFragmentFields: string[] = [];
    const gqlDocuments: GQLDocumentConfigMap = {};
    const imports: Imports = [];
    const formProps: Prop[] = [];
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
        formFragmentFields.push(...generatedFields.formFragmentFields);
        for (const name in generatedFields.gqlDocuments) {
            gqlDocuments[name] = generatedFields.gqlDocuments[name];
        }
        imports.push(...generatedFields.imports);
        formProps.push(...generatedFields.formProps);
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
            ${config.initiallyExpanded != null ? `initiallyExpanded={${config.initiallyExpanded}}` : ``}
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
        formFragmentFields.push(...generatedFields.formFragmentFields.map((field) => `${name}.${field}`));
        for (const name in generatedFields.gqlDocuments) {
            gqlDocuments[name] = generatedFields.gqlDocuments[name];
        }
        imports.push(...generatedFields.imports);
        formValuesConfig.push(...generatedFields.formValuesConfig);

        // first field is the "enabled" checkbox
        formValuesConfig.push({
            fieldName: `${name}Enabled`,
            omitFromFragmentType: false,
            destructFromFormValues: `${name}Enabled`,
            typeCode: {
                nullable: false,
                type: "boolean",
            },
            initializationCode: `!!data.${dataRootName}.${name}`,
        });

        // second field is the nested object, which is not a final-form field itself
        formValuesConfig.push({
            fieldName: `${name}`,
            wrapInitializationCode: `data.${dataRootName}.${name} ? $inner : undefined`,
            wrapFormValueToGqlInputCode: `${name}Enabled && formValues.${name} ? $inner : null`,
        });

        imports.push({ name: "FinalFormSwitch", importPath: "@comet/admin" });
        imports.push({ name: "messages", importPath: "@comet/admin" });
        imports.push({ name: "FormControlLabel", importPath: "@mui/material" });

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
        formFragmentFields,
        gqlDocuments,
        imports,
        formProps,
        formValuesConfig,
        finalFormConfig,
    };
}

import { IntrospectionObjectType, IntrospectionQuery } from "graphql";

import { FormConfig, FormFieldConfig, GeneratorReturn } from "./generator";
import { camelCaseToHumanReadable } from "./utils/camelCaseToHumanReadable";
import { Imports } from "./utils/generateImportsCode";

export function generateFormField(
    { gqlIntrospection }: { gqlIntrospection: IntrospectionQuery },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: FormFieldConfig<any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formConfig: FormConfig<any>,
): GeneratorReturn & { imports: Imports } {
    const gqlType = formConfig.gqlType;
    const instanceGqlType = gqlType[0].toLowerCase() + gqlType.substring(1);

    const name = String(config.name);
    const label = config.label ?? camelCaseToHumanReadable(name);

    const introspectionObject = gqlIntrospection.__schema.types.find((type) => type.kind === "OBJECT" && type.name === gqlType) as
        | IntrospectionObjectType
        | undefined;
    if (!introspectionObject) throw new Error(`didn't find object ${gqlType} in gql introspection`);

    const introspectionField = introspectionObject.fields.find((field) => field.name === name);
    if (!introspectionField) throw new Error(`didn't find field ${name} in gql introspection type ${gqlType}`);

    const requiredByIntrospection = introspectionField.type.kind == "NON_NULL";

    const required = config.required ?? requiredByIntrospection; //if undefined default to requiredByIntrospection

    //TODO verify introspectionField.type is compatbile with config.type

    const imports: Imports = [];
    let code = "";
    if (config.type == "text") {
        code = `
        <Field
            ${required ? "required" : ""}
            ${config.multiline ? "multiline" : ""}
            fullWidth
            name="${name}"
            component={FinalFormInput}
            label={<FormattedMessage id="${instanceGqlType}.${name}" defaultMessage="${label}" />}
        />`;
    } else if (config.type == "block") {
        imports.push({
            name: config.block.name,
            importPath: config.block.import,
        });
        code = `<Field name="${name}" isEqual={isEqual}>
            {createFinalFormBlock(${config.block.name})}
        </Field>`;
    } else {
        throw new Error(`Unsupported type: ${config.type}`);
    }
    return {
        code,
        gqlQueries: {},
        imports,
    };
}

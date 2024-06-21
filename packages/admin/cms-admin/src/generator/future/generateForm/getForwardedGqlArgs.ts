import { IntrospectionField, IntrospectionInputValue, IntrospectionQuery } from "graphql";

import { Prop } from "../generateForm";
import { FormFieldConfig } from "../generator";
import { Imports } from "../utils/generateImportsCode";

type GqlArg = { type: string; name: string; isInputArgSubfield: boolean };

export function getForwardedGqlArgs({
    fields,
    gqlOperation,
    gqlIntrospection,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fields: FormFieldConfig<any>[];
    gqlOperation: IntrospectionField;
    gqlIntrospection: IntrospectionQuery;
}): {
    imports: Imports;
    props: Prop[];
    gqlArgs: GqlArg[];
} {
    const imports: Imports = [];
    const props: Prop[] = [];
    const gqlArgs: GqlArg[] = [];

    const skipGqlInputArgFields = fields.map((field) => String(field.name));

    getArgsIncludingInputArgSubfields(gqlOperation, gqlIntrospection).forEach((arg) => {
        if (arg.isInputArgSubfield && skipGqlInputArgFields.includes(arg.name)) return;

        if (arg.type === "ID" || arg.type === "String" || arg.type === "DateTime") {
            props.push({ name: arg.name, optional: false, type: "string" });
        } else if (arg.type === "Boolean") {
            props.push({ name: arg.name, optional: false, type: "boolean" });
        } else if (arg.type === "Int" || arg.type === "Float") {
            props.push({ name: arg.name, optional: false, type: "number" });
        } else if (arg.type === "JSONObject") {
            props.push({ name: arg.name, optional: false, type: "unknown" });
        } else {
            props.push({ name: arg.name, optional: false, type: `GQL${arg.type}` }); // generated types contain GQL prefix
            imports.push({ name: `GQL${arg.type}`, importPath: "@src/graphql.generated" });
        }
        gqlArgs.push({ name: arg.name, type: arg.type, isInputArgSubfield: arg.isInputArgSubfield });
    });

    return {
        imports,
        props,
        gqlArgs,
    };
}

function getArgsIncludingInputArgSubfields(gqlOperation: IntrospectionField, gqlIntrospection: IntrospectionQuery) {
    const nativeScalars = ["ID", "String", "Boolean", "Int", "Float", "DateTime", "JSONObject"];

    // reducer is not created inline to reuse it to look into "input" arg
    function reducer(
        acc: { name: string; type: string; isInputArgSubfield: boolean }[],
        inputField: IntrospectionInputValue,
    ): { name: string; type: string; isInputArgSubfield: boolean }[] {
        if (inputField.type.kind !== "NON_NULL" || inputField.defaultValue) return acc;

        const gqlType = inputField.type.ofType;
        if (gqlType.kind === "INPUT_OBJECT") {
            if (inputField.name === "input") {
                // input-arg typically contains entity fields, so look into it
                const typeDef = gqlIntrospection.__schema.types.find((type) => type.kind === "INPUT_OBJECT" && type.name === gqlType.name);
                if (typeDef && typeDef.kind === "INPUT_OBJECT") {
                    const inputArgSubfields = typeDef.inputFields.reduce(reducer, []).map((inputArgSubfield) => {
                        return {
                            ...inputArgSubfield,
                            isInputArgSubfield: true,
                        };
                    });
                    acc.push(...inputArgSubfields);
                } else {
                    console.warn(`IntrospectionType for ${gqlType.name} not found or no INPUT_OBJECT`);
                }
            } else {
                acc.push({ name: inputField.name, type: gqlType.name, isInputArgSubfield: false });
            }
        } else if (gqlType.kind === "SCALAR") {
            if (!nativeScalars.includes(gqlType.name)) {
                console.warn(`Currently not supported special SCALAR of type ${gqlType.name} in arg/field ${inputField.name}`);
            } else {
                acc.push({ name: inputField.name, type: gqlType.name, isInputArgSubfield: false });
            }
        } else if (gqlType.kind === "ENUM") {
            acc.push({ name: inputField.name, type: gqlType.name, isInputArgSubfield: false });
        } else if (gqlType.kind === "LIST") {
            throw new Error(`Not supported kind ${gqlType.kind}, arg: input.${inputField.name}`);
        }
        return acc;
    }

    return gqlOperation.args.reduce(reducer, []);
}

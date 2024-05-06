import { IntrospectionField, IntrospectionInputValue } from "graphql";

import { Prop } from "../generateGrid";
import { Imports } from "../utils/generateImportsCode";

type GqlArg = { type: string; name: string; queryOrMutationName: string };

export function getForwardedGqlArgs(gqlFields: IntrospectionField[]): {
    imports: Imports;
    props: Prop[];
    gqlArgs: GqlArg[];
} {
    const supportedGqlArgs = ["offset", "limit", "sort", "search", "filter", "scope", "input"]; // this arguments need to be handled differently or are already handled somewhere else
    const imports: Imports = [];
    const props: Prop[] = [];
    const gqlArgs: GqlArg[] = [];

    getArgs(gqlFields, supportedGqlArgs).forEach((arg) => {
        if (arg.type === "ID" || arg.type === "String" || arg.type === "DateTime") {
            props.push({ name: arg.name, optional: false, type: "string" });
        } else if (arg.type === "Boolean") {
            props.push({ name: arg.name, optional: false, type: "boolean" });
        } else if (arg.type === "Int" || arg.type === "Float") {
            props.push({ name: arg.name, optional: false, type: "number" });
        } else if (arg.type === "JSONObject") {
            props.push({ name: arg.name, optional: false, type: "unknown" });
        } else {
            props.push({ name: arg.name, optional: false, type: arg.type });
            imports.push({ name: arg.type, importPath: "@src/graphql.generated" });
        }

        gqlArgs.push({ name: arg.name, type: arg.type, queryOrMutationName: arg.gqlField.name });
    });

    return {
        imports,
        props,
        gqlArgs,
    };
}

function getArgs(gqlFields: IntrospectionField[], skipGqlArgs: string[]) {
    return gqlFields.reduce<{ name: string; type: string; gqlArg: IntrospectionInputValue; gqlField: IntrospectionField }[]>((acc, gqlField) => {
        gqlField.args.forEach((gqlArg) => {
            if (skipGqlArgs.includes(gqlArg.name)) return acc;
            if (gqlArg.type.kind !== "NON_NULL" || gqlArg.defaultValue) return acc;

            const gqlType = gqlArg.type.ofType;

            let type = "unknown";
            if (gqlType.kind === "SCALAR") {
                const nativeScalars = ["ID", "String", "Boolean", "Int", "Float", "DateTime", "JSONObject"];
                if (!nativeScalars.includes(gqlType.name)) {
                    // probably just add to gqlFields-array, but needs to be tested
                    console.warn(`Currently not supported special SCALAR of type ${gqlType.name} in param ${gqlArg.name} of ${gqlField.name}`);
                } else {
                    type = gqlType.name;
                }
            } else if (gqlType.kind === "INPUT_OBJECT") {
                type = gqlType.name;
            } else {
                throw new Error(`Not supported kind ${gqlType.kind}, arg: ${gqlArg.name}`);
            }

            acc.push({ name: gqlArg.name, type, gqlArg, gqlField });
        });
        return acc;
    }, []);
}

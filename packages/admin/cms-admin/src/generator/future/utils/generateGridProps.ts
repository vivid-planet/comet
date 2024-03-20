import { IntrospectionField, IntrospectionInputValue, IntrospectionQuery } from "graphql";

import { GridConfig } from "../generator";

export function getRequiredQueryArgs({ gridQueryType }: { gridQueryType: IntrospectionField }) {
    const skipParams = ["offset", "limit", "sort", "search", "filter", "scope"];
    const requiredParams: IntrospectionInputValue[] = [];
    gridQueryType.args.forEach((arg) => {
        if (skipParams.includes(arg.name)) return;
        if (arg.type.kind === "NON_NULL") {
            requiredParams.push(arg);
        }
    });
    return requiredParams;
}

export function getRequiredMutationArgs({ createMutationType }: { createMutationType: IntrospectionField }) {
    const skipParams = ["input"];
    const requiredParams: IntrospectionInputValue[] = [];
    createMutationType.args.forEach((arg) => {
        if (skipParams.includes(arg.name)) return;
        if (arg.type.kind === "NON_NULL") {
            requiredParams.push(arg);
        }
    });
    return requiredParams;
}

function getRequiredGqlArgs({
    config,
    gridQueryType,
    createMutationType,
    gqlIntrospection,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: GridConfig<any>;
    gridQueryType: IntrospectionField;
    createMutationType?: IntrospectionField;
    gqlIntrospection: IntrospectionQuery;
}) {
    const params: IntrospectionInputValue[] = [];
    getRequiredQueryArgs({ gridQueryType }).forEach((param) => {
        params.push(param);
    });
    if (createMutationType) {
        getRequiredMutationArgs({ createMutationType }).forEach((arg) => {
            // skip similar params
            if (params.find((addedArg) => addedArg.name === arg.name)) return;
            params.push(arg);
        });
    }

    const requiredParams: { type: string; name: string }[] = [];
    params.forEach((arg) => {
        if (arg.type.kind !== "NON_NULL") return;

        if (arg.type.ofType.kind === "SCALAR") {
            const nativeScalars = ["ID", "String", "Boolean", "Int", "Float", "DateTime", "JSONObject"];
            if (!nativeScalars.includes(arg.type.ofType.name)) {
                // probably just add to requiredParams-array, but needs to be tested
                console.warn(
                    `Currently not supported special SCALAR of type ${arg.type.ofType.name} in required param ${arg.name} of ${gridQueryType.name}${
                        createMutationType ? ` or ${createMutationType.name}` : ``
                    }`,
                );
            } else {
                requiredParams.push({ type: arg.type.ofType.name, name: arg.name });
            }
        } else if (arg.type.ofType.kind === "INPUT_OBJECT") {
            requiredParams.push({ type: arg.type.ofType.name, name: arg.name });
        } else if (arg.type.ofType.kind === "LIST") {
            console.warn(
                `Currently not supported kind LIST in required param ${arg.name} of ${gridQueryType.name}${
                    createMutationType ? ` or ${createMutationType.name}` : ``
                }`,
            );
        } else if (arg.type.ofType.kind === "ENUM") {
            console.warn(
                `Currently not  supported kind ENUM in required param ${arg.name} of ${gridQueryType.name}${
                    createMutationType ? ` or ${createMutationType.name}` : ``
                }`,
            );
        } else {
            throw new Error(`Not supported kind ${arg.type.ofType.kind}`);
        }
    });
    return requiredParams;
}

export function getRequiredGqlArgTypesForImport({
    config,
    gridQueryType,
    createMutationType,
    gqlIntrospection,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: GridConfig<any>;
    gridQueryType: IntrospectionField;
    createMutationType?: IntrospectionField;
    gqlIntrospection: IntrospectionQuery;
}) {
    const types: string[] = [];
    getRequiredGqlArgs({ config, gridQueryType, createMutationType, gqlIntrospection }).forEach((arg) => {
        const nativeScalars = ["ID", "String", "Boolean", "Int", "Float", "DateTime", "JSONObject"];
        if (nativeScalars.includes(arg.type)) return;
        types.push(arg.type);
    });
    return types;
}

export function generateGridPropsType({
    config,
    gridQueryType,
    createMutationType,
    gqlIntrospection,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: GridConfig<any>;
    gridQueryType: IntrospectionField;
    createMutationType?: IntrospectionField;
    gqlIntrospection: IntrospectionQuery;
}) {
    const props: string[] = [];
    getRequiredGqlArgs({ config, gridQueryType, createMutationType, gqlIntrospection }).forEach((arg) => {
        let type = arg.type;
        if (arg.type === "ID" || arg.type === "String" || arg.type === "DateTime") {
            type = "string";
        } else if (arg.type === "Boolean") {
            type = "boolean";
        } else if (arg.type === "Int" || arg.type === "Float") {
            type = "number";
        } else if (arg.type === "JSONObject") {
            type = "unknown"; // because any needs eslint-disable
        }
        props.push(`${arg.name}: ${type};`);
    });
    return props.length
        ? `type Props = {
        ${props.join("\n")}
    };`
        : undefined;
}

export function generateGridProps({
    config,
    gridQueryType,
    createMutationType,
    gqlIntrospection,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: GridConfig<any>;
    gridQueryType: IntrospectionField;
    createMutationType?: IntrospectionField;
    gqlIntrospection: IntrospectionQuery;
}) {
    const props: string[] = [];
    getRequiredGqlArgs({ config, gridQueryType, createMutationType, gqlIntrospection }).forEach((requiredParam) => {
        props.push(requiredParam.name);
    });
    return props.length ? `{${props.join(", ")}}: Props` : undefined;
}

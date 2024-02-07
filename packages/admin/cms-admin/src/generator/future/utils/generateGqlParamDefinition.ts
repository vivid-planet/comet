import { IntrospectionInputValue } from "graphql";

export function generateGqlParamDefinition(queryParam: IntrospectionInputValue) {
    const isRequired = queryParam.type.kind === "NON_NULL";
    if (queryParam.type.kind === "NON_NULL") {
        if (queryParam.type.ofType.kind === "INPUT_OBJECT") {
            return `${queryParam.type.ofType.name}${isRequired ? "!" : ""}`;
        } else {
            throw new Error(`InputValue-kind ${queryParam.type.ofType.kind} below "NON_NULL" not supported`);
        }
    } else {
        throw new Error(`InputValue-kind ${queryParam.type.kind} not supported`);
    }
}

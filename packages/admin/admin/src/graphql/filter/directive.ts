// Adapted from https://github.com/apollographql/apollo-client/blob/release-2.x/packages/apollo-utilities/src/directives.ts
// Provides the methods that allow QueryManager to handle the `skip` and
// `include` directives within GraphQL.
import { argumentsObjectFromField } from "@apollo/client/utilities";
import { DirectiveNode, FieldNode } from "graphql";

export type DirectiveInfo = {
    [fieldName: string]: { [argName: string]: any };
};

// eslint-disable-next-line @typescript-eslint/ban-types
export function getDirectiveInfoFromField(field: FieldNode, variables: Object): DirectiveInfo {
    if (field.directives && field.directives.length) {
        const directiveObj: DirectiveInfo = {};
        field.directives.forEach((directive: DirectiveNode) => {
            // @ts-expect-error already wrong in graphql-anywhere
            directiveObj[directive.name.value] = argumentsObjectFromField(directive, variables);
        });
        return directiveObj;
    }
    // @ts-expect-error already wrong in graphql-anywhere
    return null;
}

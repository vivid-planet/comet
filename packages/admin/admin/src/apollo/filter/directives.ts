// Copied and adapted from https://github.com/apollographql/apollo-client/blob/release-2.x/packages/apollo-utilities/src/directives.ts

// Provides the methods that allow QueryManager to handle the `skip` and
// `include` directives within GraphQL.
import { argumentsObjectFromField, DirectiveInfo } from "@apollo/client/utilities";
import { DirectiveNode, FieldNode } from "graphql";

export function getDirectiveInfoFromField(field: FieldNode, variables: Record<string, any>): DirectiveInfo | null {
    if (field.directives && field.directives.length) {
        const directiveObj: DirectiveInfo = {};
        field.directives.forEach((directive: DirectiveNode) => {
            const argumentsObj = argumentsObjectFromField(directive, variables);
            if (argumentsObj) {
                directiveObj[directive.name.value] = argumentsObj;
            }
        });
        return directiveObj;
    }
    return null;
}

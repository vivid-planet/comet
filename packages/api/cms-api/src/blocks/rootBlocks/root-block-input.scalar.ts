import { Block } from "@comet/blocks-api";
import { GraphQLScalarType } from "graphql";
import { GraphQLJSONObject } from "graphql-type-json";

export function RootBlockInputScalar(block: Block): GraphQLScalarType {
    return new GraphQLScalarType({
        ...GraphQLJSONObject,
        specifiedByUrl: undefined,
        name: `${block.name}BlockInput`,
        description: `${block.name} root block input`,
    });
}

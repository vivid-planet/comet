import { Block } from "@comet/blocks-api";
import { GraphQLScalarType } from "graphql";
import { GraphQLJSONObject } from "graphql-type-json";

export function RootBlockDataScalar(block: Block): GraphQLScalarType {
    return new GraphQLScalarType({
        ...GraphQLJSONObject,
        specifiedByUrl: undefined,
        name: `${block.name}BlockData`,
        description: `${block.name} root block data`,
    });
}

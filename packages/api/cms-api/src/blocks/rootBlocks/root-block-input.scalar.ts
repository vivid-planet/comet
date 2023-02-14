import { Block } from "@comet/blocks-api";
import { GraphQLScalarType } from "graphql";
import { GraphQLJSONObject } from "graphql-type-json";

const rootBlockInputScalars = new Map<string, GraphQLScalarType>();

export function RootBlockInputScalar(block: Block): GraphQLScalarType {
    let scalar = rootBlockInputScalars.get(block.name);

    if (scalar !== undefined) {
        return scalar;
    }

    scalar = new GraphQLScalarType({
        ...GraphQLJSONObject,
        specifiedByUrl: undefined,
        name: `${block.name}BlockInput`,
        description: `${block.name} root block input`,
    });

    rootBlockInputScalars.set(block.name, scalar);

    return scalar;
}

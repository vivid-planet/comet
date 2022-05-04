import { InMemoryCache, PossibleTypesMap } from "@apollo/client";
import fragmentTypes from "@src/fragmentTypes.json";

const possibleTypes: PossibleTypesMap = {};
for (const type of fragmentTypes.__schema.types) {
    possibleTypes[type.name] = type.possibleTypes.map((possibleType) => possibleType.name);
}

export const inMemoryCache = new InMemoryCache({
    possibleTypes,
    typePolicies: {},
});

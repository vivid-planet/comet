import { type ContentScope } from "../interfaces/content-scope.interface";

export function sortContentScopeKeysAlphabetically(obj: ContentScope): ContentScope {
    return Object.keys(obj)
        .sort()
        .reduce<ContentScope>((acc, key) => {
            acc[key as keyof ContentScope] = obj[key as keyof ContentScope];
            return acc;
        }, {});
}

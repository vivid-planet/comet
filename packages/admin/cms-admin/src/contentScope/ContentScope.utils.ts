import { ContentScopeInterface } from "./Provider";

export const combineObjects = ([head, ...[headTail, ...tailTail]]: ContentScopeInterface[][]): ContentScopeInterface[] => {
    if (!headTail) return [head];

    const combined = headTail.reduce((acc: ContentScopeInterface[][], x) => {
        return acc.concat(head.map((h) => [h, x]));
    }, []);

    return combineObjects([combined, ...tailTail] as ContentScopeInterface[][]).flat();
};

export const wrapInArray = (value: unknown | unknown[]) => (Array.isArray(value) ? value : [value]);

export const capitalizeString = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

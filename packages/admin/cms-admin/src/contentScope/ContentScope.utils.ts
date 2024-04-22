import { ContentScopeInterface } from "./Provider";

export const wrapInArray = (value: unknown | unknown[]) => (Array.isArray(value) ? value : [value]);

export const capitalizeString = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export const showLabelIfAvailable = (val: ContentScopeInterface) => (val.label ? val.label : val.value);

export const joinLabels = (scope: ContentScopeInterface, groupKey: string) =>
    Object.keys(scope)
        .filter((key) => key !== groupKey)
        .map((key) => capitalizeString(showLabelIfAvailable(scope[key])))
        .join(" - ");

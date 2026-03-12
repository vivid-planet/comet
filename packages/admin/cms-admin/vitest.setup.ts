import { CSSStyleDeclaration } from "cssstyle";

// Workaround for https://github.com/jsdom/cssstyle/issues/247
// cssstyle crashes when resolving border shorthands containing var() or CSS global keywords.
// This suppresses the specific TypeError until the upstream fix lands (see also https://github.com/jsdom/cssstyle/issues/319).
// TODO: Remove this once fixed in cssstyle
const originalSetProperty = CSSStyleDeclaration.prototype.setProperty;
CSSStyleDeclaration.prototype.setProperty = function (...args) {
    try {
        return originalSetProperty.apply(this, args);
    } catch (error) {
        if (error instanceof TypeError && error.message.includes("Cannot create property 'border-width' on string")) {
            return;
        }
        throw error;
    }
};

/**
 * Helper function to enable syntax highlighting & auto-formatting for CSS strings when using certain IDE plugins, e.g. the "styled-components" plugin in VSCode.
 */
export const css = (strings: TemplateStringsArray, ...rest: unknown[]): string => String.raw({ raw: strings }, ...rest);

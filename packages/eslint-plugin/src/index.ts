import graphqlNamingConvention from "./rules/graphql-naming-convention";
import noOtherModuleRelativeImport from "./rules/no-other-module-relative-import";
import noPrivateSiblingImport from "./rules/no-private-sibling-import";

/**
 * The rules use the ESLint rule API, which Oxlint supports through JS plugins. Therefore the plugin can be used
 * with both linters:
 *
 * ESLint (`eslint.config.mjs`):
 *
 * ```js
 * import dextinityPlugin from "@dextinity/eslint-plugin";
 *
 * export default [{ plugins: { "@dextinity": dextinityPlugin } }];
 * ```
 *
 * Oxlint (`oxlint.config.mjs`):
 *
 * ```js
 * export default {
 *     jsPlugins: [{ name: "@dextinity", specifier: "@dextinity/eslint-plugin" }],
 * };
 * ```
 */
const plugin = {
    meta: {
        name: "@dextinity/eslint-plugin",
    },
    rules: {
        "graphql-naming-convention": graphqlNamingConvention,
        "no-private-sibling-import": noPrivateSiblingImport,
        "no-other-module-relative-import": noOtherModuleRelativeImport,
    },
};
export type Plugin = typeof plugin;

module.exports = plugin;

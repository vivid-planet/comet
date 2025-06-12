import noJsxStringLiterals from "./rules/no-jsx-string-literals";
import noOtherModuleRelativeImport from "./rules/no-other-module-relative-import";
import noPrivateSiblingImport from "./rules/no-private-sibling-import";

const plugin = {
    rules: {
        "no-jsx-string-literals": noJsxStringLiterals,
        "no-private-sibling-import": noPrivateSiblingImport,
        "no-other-module-relative-import": noOtherModuleRelativeImport,
    },
};
export type Plugin = typeof plugin;

module.exports = plugin;

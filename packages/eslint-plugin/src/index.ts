import noOtherModuleRelativeImport from "./rules/no-other-module-relative-import";
import noPrivateSiblingImport from "./rules/no-private-sibling-import";
import pascalCaseEnums from "./rules/pascal-case-enums";

const plugin = {
    rules: {
        "no-private-sibling-import": noPrivateSiblingImport,
        "no-other-module-relative-import": noOtherModuleRelativeImport,
        "pascal-case-enums": pascalCaseEnums,
    },
};
export type Plugin = typeof plugin;

module.exports = plugin;

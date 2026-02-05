import noCometLibImport from "./rules/no-comet-lib-import";
import noOtherModuleRelativeImport from "./rules/no-other-module-relative-import";
import noPrivateSiblingImport from "./rules/no-private-sibling-import";

const plugin = {
    rules: {
        "no-comet-lib-import": noCometLibImport,
        "no-private-sibling-import": noPrivateSiblingImport,
        "no-other-module-relative-import": noOtherModuleRelativeImport,
    },
};
export type Plugin = typeof plugin;

module.exports = plugin;

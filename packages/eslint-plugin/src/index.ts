import noPrivateSiblingImport from "./rules/no-private-sibling-import";
const plugin = {
    rules: {
        "no-private-sibling-import": noPrivateSiblingImport,
    },
};
export type Plugin = typeof plugin;

module.exports = plugin;

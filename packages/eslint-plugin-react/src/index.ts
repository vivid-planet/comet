import idAllowListReactIntl from "./rules/idAllowListReactIntl/idAllowListReactIntl";
const plugin = {
    rules: {
        "id-allow-list-react-intl": idAllowListReactIntl,
    },
};
export type Plugin = typeof plugin;

module.exports = plugin;

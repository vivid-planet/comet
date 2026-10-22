import { addons } from "storybook/manager-api";
import { defaultConfig, type TagBadgeParameters } from "storybook-addon-tag-badges/manager-helpers";

import theme from "./theme";

addons.setConfig({
    theme,
    tagBadges: [
        {
            tags: "new-ui",
            badge: {
                text: "New UI",
                style: { backgroundColor: "hsl(130, 40%, 76%)", borderColor: "hsl(130, 40%, 34%)", color: "hsl(130, 60%, 12%)" },
            },
            display: { sidebar: [{ type: "docs", skipInherited: false }], toolbar: false, mdx: false },
        },
        ...defaultConfig,
    ] satisfies TagBadgeParameters,
});

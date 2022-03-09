import { StyleRules } from "@material-ui/core";
import { createStyles } from "@material-ui/styles";

import { Props } from "./RouterTabs";

export type RouterTabsClassKey = "root" | "tabs" | "content" | "contentHidden";

export const styles = (): StyleRules<RouterTabsClassKey, Props> => {
    return createStyles<RouterTabsClassKey, Props>({
        root: {},
        tabs: {},
        content: {},
        contentHidden: {
            display: "none",
        },
    });
};

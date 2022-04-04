import { createStyles } from "@mui/styles";

import { Props } from "./RouterTabs";

export type RouterTabsClassKey = "root" | "tabs" | "content" | "contentHidden";

export const styles = () => {
    return createStyles<RouterTabsClassKey, Props>({
        root: {},
        tabs: {},
        content: {},
        contentHidden: {
            display: "none",
        },
    });
};

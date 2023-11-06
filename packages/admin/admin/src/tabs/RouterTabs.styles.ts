import { createStyles } from "@mui/styles";

import { RouterTabsProps } from "./RouterTabs";

export type RouterTabsClassKey = "root" | "tabs" | "content" | "contentHidden";

export const styles = () => {
    return createStyles<RouterTabsClassKey, RouterTabsProps>({
        root: {},
        tabs: {},
        content: {},
        contentHidden: {
            display: "none",
        },
    });
};

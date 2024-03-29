import { createStyles } from "@mui/styles";

import { TabsProps } from "./Tabs";

export type TabsClassKey = "root" | "tabs" | "content" | "contentHidden";

export const styles = () => {
    return createStyles<TabsClassKey, TabsProps>({
        root: {},
        tabs: {},
        content: {},
        contentHidden: {
            display: "none",
        },
    });
};

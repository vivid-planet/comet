import { createStyles } from "@mui/styles";

import { TabsProps } from "./Tabs";

export type TabsClassKey = "root" | "tabs" | "content";

export const styles = () => {
    return createStyles<TabsClassKey, TabsProps>({
        root: {},
        tabs: {},
        content: {},
    });
};

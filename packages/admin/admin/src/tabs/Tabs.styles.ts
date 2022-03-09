import { StyleRules } from "@material-ui/core";
import { createStyles } from "@material-ui/styles";

import { TabsProps } from "./Tabs";

export type TabsClassKey = "root" | "tabs" | "content";

export const styles = (): StyleRules<TabsClassKey, TabsProps> => {
    return createStyles<TabsClassKey, TabsProps>({
        root: {},
        tabs: {},
        content: {},
    });
};

import { createStyles } from "@material-ui/styles";

export type TabsClassKey = "root" | "tabs" | "content";

export const styles = () => {
    return createStyles<TabsClassKey, any>({
        root: {},
        tabs: {},
        content: {},
    });
};

import { createStyles } from "@material-ui/styles";

export type RouterTabsClassKey = "root" | "tabs" | "content" | "contentHidden";

export const styles = () => {
    return createStyles<RouterTabsClassKey, any>({
        root: {},
        tabs: {},
        content: {},
        contentHidden: {
            display: "none",
        },
    });
};

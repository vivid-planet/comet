import { Theme } from "@material-ui/core/styles";
import { createStyles } from "@material-ui/styles";

export type MasterLayoutClassKey = "root" | "header" | "contentWrapper";

export const styles = ({ zIndex }: Theme) => {
    return createStyles<MasterLayoutClassKey, any>({
        root: {
            display: "flex",
            flexWrap: "nowrap",
        },
        header: {
            zIndex: zIndex.drawer + 1,
        },
        contentWrapper: {
            flexGrow: 1,
            paddingTop: "var(--comet-admin-master-layout-content-top-spacing)",
        },
    });
};

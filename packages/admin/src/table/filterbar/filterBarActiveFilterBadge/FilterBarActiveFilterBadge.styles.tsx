import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";

export type CometAdminFilterBarActiveFilterBadgeClassKeys = "hasValueCount";

export const useStyles = makeStyles(
    (theme: Theme) => ({
        hasValueCount: {
            backgroundColor: `${theme.palette.grey[100]}`,
            boxSizing: "border-box",
            textAlign: "center",
            borderRadius: "4px",
            padding: "2px 5px",
            marginRight: "4px",
            fontSize: "12px",
            height: "20px",
        },
    }),
    { name: "CometAdminFilterBarActiveFilterBadge" },
);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminFilterBarActiveFilterBadge: CometAdminFilterBarActiveFilterBadgeClassKeys;
    }
}

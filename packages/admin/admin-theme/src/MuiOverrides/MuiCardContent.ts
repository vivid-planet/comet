import { CardContentClassKey } from "@material-ui/core";
import { Spacing } from "@material-ui/core/styles/createSpacing";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMuiCardContentOverrides = (spacing: Spacing): StyleRules<Record<string, unknown>, CardContentClassKey> => ({
    root: {
        padding: spacing(4),
        "&:last-child": {
            paddingBottom: spacing(4),
        },
    },
});

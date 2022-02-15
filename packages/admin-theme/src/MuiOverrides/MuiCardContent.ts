import { CardContentClassKey } from "@mui/material";
import { OverridesStyleRules } from "@mui/material/styles/overrides";
import { Spacing } from "@mui/system";

export const getMuiCardContentOverrides = (spacing: Spacing): OverridesStyleRules<CardContentClassKey> => ({
    root: {
        padding: spacing(4),
        "&:last-child": {
            paddingBottom: spacing(4),
        },
    },
});

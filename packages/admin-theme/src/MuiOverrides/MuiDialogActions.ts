import { DialogActionsClassKey } from "@mui/material";
import { Palette } from "@mui/material/styles";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const getMuiDialogActionsOverrides = (palette: Palette): OverridesStyleRules<DialogActionsClassKey> => ({
    root: {
        borderTop: `1px solid ${palette.grey[100]}`,
        padding: 20,
        justifyContent: "space-between",
        "&>:first-child:last-child": {
            marginLeft: "auto",
        },
    },
    spacing: {},
});

import { DialogContentTextClassKey } from "@mui/material";
import { Palette } from "@mui/material/styles";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const getMuiDialogTextContentOverrides = (palette: Palette): OverridesStyleRules<DialogContentTextClassKey> => ({
    root: {
        color: palette.text.primary,
        marginBottom: 20,
    },
});

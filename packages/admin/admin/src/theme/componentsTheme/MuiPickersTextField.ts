import { type Components } from "@mui/material/styles";
import type {} from "@mui/x-date-pickers/themeAugmentation";

export const getMuiPickersTextField = (component: Components["MuiPickersTextField"]): Components["MuiPickersTextField"] => ({
    ...component,
    defaultProps: {
        variant: "standard",
        ...component?.defaultProps,
    },
});

import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiLinearProgress: GetMuiComponentTheme<"MuiLinearProgress"> = (component) => ({
    ...component,
    defaultProps: {
        color: "primary",
        sx: {
            height: "2px",
            zIndex: 1, // for use in LoadingOverlay of DataGrid, otherwise the LinearProgress is behind the border
        },
    },
});

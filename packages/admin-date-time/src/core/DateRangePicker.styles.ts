import zIndex from "@material-ui/core/styles/zIndex";
import { createStyles } from "@material-ui/styles";

export type CometAdminDateRangePickerClassKeys = "root" | "fullWidth" | "disabled" | "inputBase" | "input" | "separator" | "popper";

const styles = () => {
    return createStyles<CometAdminDateRangePickerClassKeys, any>({
        root: {
            position: "relative",
            display: "inline-block",
            width: 260,
        },
        fullWidth: {
            display: "block",
            width: "100%",
        },
        disabled: {},
        inputBase: {
            width: "100%",
        },
        input: {
            textAlign: "center",
        },
        separator: {},
        popper: {
            zIndex: zIndex.modal,
            "& [class*='MuiPaper-root']": {
                overflowX: "auto",
            },
        },
    });
};

export default styles;

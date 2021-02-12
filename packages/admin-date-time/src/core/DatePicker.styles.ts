import zIndex from "@material-ui/core/styles/zIndex";
import { createStyles } from "@material-ui/styles";

export type CometAdminDatePickerClassKeys = "root" | "fullWidth" | "disabled" | "inputBase" | "popper";

const styles = () => {
    return createStyles<CometAdminDatePickerClassKeys, any>({
        root: {
            position: "relative",
            display: "inline-block",
            width: 180,
        },
        fullWidth: {
            display: "block",
            width: "100%",
        },
        disabled: {},
        inputBase: {
            width: "100%",
        },
        popper: {
            zIndex: zIndex.modal,
            "& [class*='MuiPaper-root']": {
                overflowX: "auto",
            },
        },
    });
};

export default styles;

import zIndex from "@material-ui/core/styles/zIndex";
import { createStyles } from "@material-ui/styles";

export type CometAdminTimePickerClassKeys = "root" | "fullWidth" | "disabled" | "inputBase" | "popper";

const styles = () => {
    return createStyles<CometAdminTimePickerClassKeys, any>({
        root: {
            position: "relative",
            display: "inline-block",
            width: 120,
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
                height: 360,
                overflowX: "auto",
            },
        },
    });
};

export default styles;

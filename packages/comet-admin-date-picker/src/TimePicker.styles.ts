import { Theme } from "@material-ui/core";
import zIndex from "@material-ui/core/styles/zIndex";
import { createStyles } from "@material-ui/styles";
import { getDefaultVPAdminInputStyles } from "@vivid-planet/comet-admin";

export type CometAdminTimePickerClassKeys = "root" | "fullWidth" | "disabled" | "inputWrapper" | "inputBase" | "input" | "iconWrapper" | "popper";

const styles = (theme: Theme) => {
    const inputDefaultStyles = getDefaultVPAdminInputStyles(theme);

    return createStyles<CometAdminTimePickerClassKeys, any>({
        root: {
            position: "relative",
            display: "inline-block",
            "&$fullWidth": {
                display: "block",
            },
        },
        fullWidth: {},
        disabled: {},
        inputWrapper: {
            position: "relative",
            marginBottom: 0,
            "&:focus": {
                outline: "none",
            },
        },
        inputBase: {
            ...inputDefaultStyles,
            display: "flex",
            paddingRight: 0,
        },
        input: {
            "&::-ms-clear": {
                display: "none",
            },
        },
        iconWrapper: {
            position: "absolute",
            zIndex: 1,
            right: 0,
            top: 0,
            bottom: 0,
            width: 46,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        popper: {
            zIndex: zIndex.modal,
            "& .MuiPaper-root": {
                height: 360,
                overflowX: "auto",
            },
        },
    });
};

export default styles;

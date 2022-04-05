import { Theme } from "@mui/material";
import { createStyles } from "@mui/styles";

import { InputWithPopperProps } from "./InputWithPopper";

export type InputWithPopperClassKey = "root" | "inputBase" | "popper" | "paper";

export const styles = ({ zIndex }: Theme) => {
    return createStyles<InputWithPopperClassKey, InputWithPopperProps>({
        root: {},
        inputBase: {},
        popper: {
            zIndex: zIndex.modal,
        },
        paper: {
            transformOrigin: "top left",
        },
    });
};

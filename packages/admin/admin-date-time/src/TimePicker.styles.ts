import { InputWithPopperClassKey } from "@comet/admin";
import { createStyles } from "@mui/styles";

import { TimePickerProps } from "./TimePicker";

export type TimePickerClassKey = InputWithPopperClassKey;

export const styles = () =>
    createStyles<TimePickerClassKey, TimePickerProps>({
        root: {},
        inputBase: {},
        popper: {},
        paper: {
            minWidth: 110,
            height: 324,
            overflowY: "auto",
        },
    });

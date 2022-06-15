import { InputWithPopperClassKey } from "@comet/admin";
import { menuItemClasses, Theme } from "@mui/material";
import { createStyles } from "@mui/styles";

import { TimePickerProps } from "./TimePicker";

export type TimePickerClassKey = InputWithPopperClassKey;

export const styles = ({ spacing }: Theme) =>
    createStyles<TimePickerClassKey, TimePickerProps>({
        root: {},
        inputBase: {},
        popper: {},
        paper: {
            minWidth: 110,
            height: 280,
            overflowY: "auto",

            [`& .${menuItemClasses.root}`]: {
                padding: `${spacing(2)} ${spacing(3)}`,
            },
        },
    });

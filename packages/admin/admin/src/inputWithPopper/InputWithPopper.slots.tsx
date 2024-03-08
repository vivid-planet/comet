import { InputBase as MuiInputBase, Paper as MuiPaper, Popper as MuiPopper } from "@mui/material";
import { css } from "@mui/material/styles";

import { createSlot } from "../helpers/createSlot";

export type InputWithPopperClassKey = "root" | "inputBase" | "popper" | "paper";

export const Root = createSlot("div")<InputWithPopperClassKey>({
    componentName: "InputWithPopper",
    slotName: "root",
})();

// @ts-expect-error TODO: Fix type
export const InputBase = createSlot(MuiInputBase)<InputWithPopperClassKey>({
    componentName: "InputWithPopper",
    slotName: "inputBase",
})();

export const Popper = createSlot(MuiPopper)<InputWithPopperClassKey>({
    componentName: "InputWithPopper",
    slotName: "popper",
})(
    ({ theme }) => css`
        z-index: ${theme.zIndex.modal};
    `,
);

export const Paper = createSlot(MuiPaper)<InputWithPopperClassKey>({
    componentName: "InputWithPopper",
    slotName: "paper",
})(css`
    transform-origin: top left;
    font-size: 0;
    line-height: 0;
    border-radius: 4px;
`);

import { InputBase as MuiInputBase, Paper as MuiPaper, Popper as MuiPopper } from "@mui/material";
import { css } from "@mui/material/styles";

import { createComponentSlot } from "../helpers/createComponentSlot";

export type InputWithPopperClassKey = "root" | "inputBase" | "popper" | "paper";

export const Root = createComponentSlot("div")<InputWithPopperClassKey>({
    componentName: "InputWithPopper",
    slotName: "root",
})();

export const InputBase = createComponentSlot(MuiInputBase)<InputWithPopperClassKey>({
    componentName: "InputWithPopper",
    slotName: "inputBase",
})();

export const Popper = createComponentSlot(MuiPopper)<InputWithPopperClassKey>({
    componentName: "InputWithPopper",
    slotName: "popper",
})(
    ({ theme }) => css`
        z-index: ${theme.zIndex.modal};
    `,
);

export const Paper = createComponentSlot(MuiPaper)<InputWithPopperClassKey>({
    componentName: "InputWithPopper",
    slotName: "paper",
})(css`
    transform-origin: top left;
    font-size: 0;
    line-height: 0;
    border-radius: 4px;
`);

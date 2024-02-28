import { InputBase as MuiInputBase, Paper as MuiPaper, Popper as MuiPopper } from "@mui/material";
import { css, styled } from "@mui/material/styles";

export type InputWithPopperClassKey = "root" | "inputBase" | "popper" | "paper";

export const Root = styled("div", {
    name: "CometAdminInputWithPopper",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})(css``);

export const InputBase = styled(MuiInputBase, {
    name: "CometAdminInputWithPopper",
    slot: "inputBase",
    overridesResolver(_, styles) {
        return [styles.inputBase];
    },
})(css``);

export const Popper = styled(MuiPopper, {
    name: "CometAdminInputWithPopper",
    slot: "popper",
    overridesResolver(_, styles) {
        return [styles.popper];
    },
})(
    ({ theme }) => css`
        z-index: ${theme.zIndex.modal};
    `,
);

export const Paper = styled(MuiPaper, {
    name: "CometAdminInputWithPopper",
    slot: "paper",
    overridesResolver(_, styles) {
        return [styles.paper];
    },
})(css`
    transform-origin: top left;
    font-size: 0;
    line-height: 0;
    border-radius: 4px;
`);

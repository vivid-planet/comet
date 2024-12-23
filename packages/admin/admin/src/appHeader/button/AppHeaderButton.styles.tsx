import { ButtonBase, Typography } from "@mui/material";
import { css } from "@mui/material/styles";

import { createComponentSlot } from "../../helpers/createComponentSlot";

export type AppHeaderButtonClassKey = "root" | "content" | "startIcon" | "endIcon" | "typography";

export const Root = createComponentSlot(ButtonBase)<AppHeaderButtonClassKey>({
    componentName: "AppHeaderButton",
    slotName: "root",
})(css`
    height: 100%;
    border-left: 1px solid rgba(255, 255, 255, 0.2);
`);

export const Content = createComponentSlot("div")<AppHeaderButtonClassKey>({
    componentName: "AppHeaderButton",
    slotName: "content",
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        box-sizing: border-box;
        padding-left: ${theme.spacing(2)};
        padding-right: ${theme.spacing(2)};

        ${theme.breakpoints.up("md")} {
            padding-left: ${theme.spacing(4)};
            padding-right: ${theme.spacing(4)};
            min-width: var(--header-height);
        }
    `,
);

export const StartIcon = createComponentSlot("div")<AppHeaderButtonClassKey>({
    componentName: "AppHeaderButton",
    slotName: "startIcon",
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;

        &:not(:last-child) {
            margin-right: ${theme.spacing(2)};
        }
    `,
);

export const EndIcon = createComponentSlot("div")<AppHeaderButtonClassKey>({
    componentName: "AppHeaderButton",
    slotName: "endIcon",
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;

        :not(:first-of-type) {
            margin-left: ${theme.spacing(2)};
        }
    `,
);

export const Text = createComponentSlot(Typography)<AppHeaderButtonClassKey>({
    componentName: "AppHeaderButton",
    slotName: "typography",
})() as typeof Typography;

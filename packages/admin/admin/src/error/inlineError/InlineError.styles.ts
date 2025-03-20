import { Typography } from "@mui/material";
import { css } from "@mui/material/styles";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { type InlineErrorClassKey } from "./InlineError";

export const Root = createComponentSlot("div")<InlineErrorClassKey>({
    componentName: "InlineError",
    slotName: "root",
})(css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0;
`);

export const IconContainer = createComponentSlot("div")<InlineErrorClassKey>({
    componentName: "InlineError",
    slotName: "iconContainer",
})(
    ({ theme }) => css`
        margin-bottom: ${theme.spacing(2)};
    `,
);

export const Title = createComponentSlot(Typography)<InlineErrorClassKey>({
    componentName: "InlineError",
    slotName: "title",
})(
    ({ theme }) => css`
        text-align: center;
        margin-bottom: ${theme.spacing(1)};
    `,
);

export const Description = createComponentSlot(Typography)<InlineErrorClassKey>({
    componentName: "InlineError",
    slotName: "description",
})(css`
    text-align: center;
`);

export const ActionsContainer = createComponentSlot("div")<InlineErrorClassKey>({
    componentName: "InlineError",
    slotName: "actionsContainer",
})(
    ({ theme }) => css`
        margin-top: ${theme.spacing(4)};
    `,
);

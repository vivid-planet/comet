import { createComponentSlot } from "@comet/admin";
import { Card, css, Divider, Typography } from "@mui/material";

import { type NotFoundClassKey } from "./NotFound";

export const Root = createComponentSlot("div")<NotFoundClassKey>({
    componentName: "NotFound",
    slotName: "root",
})(
    ({ theme }) => css`
        display: flex;
        justify-content: center;
        align-items: center;
        height: calc(100vh - var(--comet-admin-master-layout-content-top-spacing));
        background-color: ${theme.palette.grey["100"]};
    `,
);

export const ContentContainer = createComponentSlot(Card)<NotFoundClassKey>({
    componentName: "NotFound",
    slotName: "contentContainer",
})(({ theme }) => {
    return css`
        display: flex;
        max-width: 550px;
        align-items: center;
        gap: ${theme.spacing(2)};
        flex-direction: column;
        padding: ${theme.spacing(10)};
    `;
});

export const IconContainer = createComponentSlot("div")<NotFoundClassKey>({
    componentName: "NotFound",
    slotName: "iconContainer",
})(
    ({ theme }) => css`
        margin-bottom: ${theme.spacing(2)};
    `,
);

export const Title = createComponentSlot(Typography)<NotFoundClassKey>({
    componentName: "NotFound",
    slotName: "title",
})(css``);

export const Info = createComponentSlot(Typography)<NotFoundClassKey>({
    componentName: "NotFound",
    slotName: "info",
})(css``);

export const DividerStyled = createComponentSlot(Divider)<NotFoundClassKey>({
    componentName: "NotFound",
    slotName: "divider",
})(
    ({ theme }) => css`
        width: 100%;
        margin-top: ${theme.spacing(6)};
        margin-bottom: ${theme.spacing(6)};
    `,
);

export const LogoContainer = createComponentSlot("div")<NotFoundClassKey>({
    componentName: "NotFound",
    slotName: "logoContainer",
})(
    ({ theme }) => css`
        margin-bottom: ${theme.spacing(6)};
    `,
);

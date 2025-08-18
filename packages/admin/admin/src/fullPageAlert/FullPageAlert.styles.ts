import { Card, css, Divider, Typography } from "@mui/material";

import { createComponentSlot } from "../helpers/createComponentSlot";
import { type FullPageAlertClassKey } from "./FullPageAlert";

export const Root = createComponentSlot("div")<FullPageAlertClassKey>({
    componentName: "FullPageAlert",
    slotName: "root",
})(
    ({ theme }) => css`
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: ${theme.palette.grey["100"]};
    `,
);

export const ContentContainer = createComponentSlot(Card)<FullPageAlertClassKey>({
    componentName: "FullPageAlert",
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

export const Title = createComponentSlot(Typography)<FullPageAlertClassKey>({
    componentName: "FullPageAlert",
    slotName: "title",
})(css``);

export const DetailDescription = createComponentSlot(Typography)<FullPageAlertClassKey>({
    componentName: "FullPageAlert",
    slotName: "info",
})(css``);

export const DividerStyled = createComponentSlot(Divider)<FullPageAlertClassKey>({
    componentName: "FullPageAlert",
    slotName: "divider",
})(
    ({ theme }) => css`
        width: 100%;
        margin-top: ${theme.spacing(6)};
        margin-bottom: ${theme.spacing(6)};
    `,
);

export const LogoContainer = createComponentSlot("div")<FullPageAlertClassKey>({
    componentName: "FullPageAlert",
    slotName: "logoContainer",
})(
    ({ theme }) => css`
        margin-bottom: ${theme.spacing(6)};
    `,
);

export const ActionContainer = createComponentSlot("div")<FullPageAlertClassKey>({
    componentName: "FullPageAlert",
    slotName: "actionContainer",
})(css`
    width: 100%;
    display: flex;
`);

import { Card, css, Divider, Typography } from "@mui/material";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { type ErrorPageClassKey } from "./ErrorPage";

export const Root = createComponentSlot("div")<ErrorPageClassKey>({
    componentName: "ErrorPage",
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

export const ContentContainer = createComponentSlot(Card)<ErrorPageClassKey>({
    componentName: "ErrorPage",
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

export const Title = createComponentSlot(Typography)<ErrorPageClassKey>({
    componentName: "ErrorPage",
    slotName: "title",
})(css``);

export const Info = createComponentSlot(Typography)<ErrorPageClassKey>({
    componentName: "ErrorPage",
    slotName: "info",
})(css``);

export const DividerStyled = createComponentSlot(Divider)<ErrorPageClassKey>({
    componentName: "ErrorPage",
    slotName: "divider",
})(
    ({ theme }) => css`
        width: 100%;
        margin-top: ${theme.spacing(6)};
        margin-bottom: ${theme.spacing(6)};
    `,
);

export const LogoContainer = createComponentSlot("div")<ErrorPageClassKey>({
    componentName: "ErrorPage",
    slotName: "logoContainer",
})(
    ({ theme }) => css`
        margin-bottom: ${theme.spacing(6)};
    `,
);

export const ActionContainer = createComponentSlot("div")<ErrorPageClassKey>({
    componentName: "ErrorPage",
    slotName: "actionContainer",
})(css`
    width: 100%;
    display: flex;
`);

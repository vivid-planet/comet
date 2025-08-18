import { css } from "@emotion/react";
import { Box, Typography } from "@mui/material";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { type ActionLogHeaderClassKey } from "./ActionLogHeader";

export const Root = createComponentSlot(Box)<ActionLogHeaderClassKey>({
    componentName: "ActionLogHeader",
    slotName: "root",
})(() => css``);

export const TitleContainer = createComponentSlot(Box)<ActionLogHeaderClassKey>({
    componentName: "ActionLogHeader",
    slotName: "titleContainer",
})(
    ({ theme }) => css`
        display: flex;
        margin-bottom: ${theme.spacing(2)};
    `,
);

export const InfoContainer = createComponentSlot(Box)<ActionLogHeaderClassKey>({
    componentName: "ActionLogHeader",
    slotName: "infoContainer",
})(
    ({ theme }) => css`
        display: flex;
        justify-content: space-between;
        margin-bottom: ${theme.spacing(4)};
    `,
);

export const TitleTypography = createComponentSlot(Typography)<ActionLogHeaderClassKey>({
    componentName: "ActionLogHeader",
    slotName: "titleTypography",
})(() => css``) as typeof Typography;

export const UuidLabel = createComponentSlot(Typography)<ActionLogHeaderClassKey>({
    componentName: "ActionLogHeader",
    slotName: "uuidLabel",
})(() => css``) as typeof Typography;

export const UuidValue = createComponentSlot(Typography)<ActionLogHeaderClassKey>({
    componentName: "ActionLogHeader",
    slotName: "uuidValue",
})(() => css``) as typeof Typography;

export const DbTypeLabel = createComponentSlot(Typography)<ActionLogHeaderClassKey>({
    componentName: "ActionLogHeader",
    slotName: "dbTypeLabel",
})(() => css``) as typeof Typography;

export const DbTypeValue = createComponentSlot(Typography)<ActionLogHeaderClassKey>({
    componentName: "ActionLogHeader",
    slotName: "dbTypeValue",
})(() => css``) as typeof Typography;

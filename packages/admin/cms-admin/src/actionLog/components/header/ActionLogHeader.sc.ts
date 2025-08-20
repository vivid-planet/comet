import { createComponentSlot } from "@comet/admin";
import { Box, css, Typography } from "@mui/material";

import { type ActionLogHeaderClassKey } from "./ActionLogHeader";

export const Root = createComponentSlot(Box)<ActionLogHeaderClassKey>({
    componentName: "ActionLogHeader",
    slotName: "root",
})();

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
    slotName: "title",
})() as typeof Typography;

export const InfoContent = createComponentSlot(Box)<ActionLogHeaderClassKey>({
    componentName: "ActionLogHeader",
    slotName: "infoContent",
})(
    ({ theme }) => css`
        gap: ${theme.spacing(2)};
        display: flex;
    `,
);

export const UuidLabel = createComponentSlot(Typography)<ActionLogHeaderClassKey>({
    componentName: "ActionLogHeader",
    slotName: "uuidLabel",
})() as typeof Typography;

export const UuidValue = createComponentSlot(Typography)<ActionLogHeaderClassKey>({
    componentName: "ActionLogHeader",
    slotName: "uuidValue",
})() as typeof Typography;

export const DbTypeLabel = createComponentSlot(Typography)<ActionLogHeaderClassKey>({
    componentName: "ActionLogHeader",
    slotName: "dbTypeLabel",
})() as typeof Typography;

export const DbTypeValue = createComponentSlot(Typography)<ActionLogHeaderClassKey>({
    componentName: "ActionLogHeader",
    slotName: "dbTypeValue",
})() as typeof Typography;

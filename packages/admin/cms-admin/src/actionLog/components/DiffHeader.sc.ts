import { createComponentSlot } from "@comet/admin";
import { Box, css, Typography } from "@mui/material";

import { type DiffHeaderClassKey } from "./DiffHeader";

export const Root = createComponentSlot(Box)<DiffHeaderClassKey>({
    componentName: "DiffHeader",
    slotName: "root",
})(
    ({ theme }) => css`
        display: flex;
        flex-direction: column;
        align-items: start;
        background-color: ${theme.palette.grey.A200};
        padding: ${theme.spacing(2)};
    `,
);

export const Version = createComponentSlot(Typography)<DiffHeaderClassKey>({
    componentName: "DiffHeader",
    slotName: "version",
})();
export const UserName = createComponentSlot(Typography)<DiffHeaderClassKey>({
    componentName: "DiffHeader",
    slotName: "userName",
})();

export const Date = createComponentSlot(Typography)<DiffHeaderClassKey>({
    componentName: "DiffHeader",
    slotName: "date",
})();

export const Info = createComponentSlot(Typography)<DiffHeaderClassKey>({
    componentName: "DiffHeader",
    slotName: "info",
})();

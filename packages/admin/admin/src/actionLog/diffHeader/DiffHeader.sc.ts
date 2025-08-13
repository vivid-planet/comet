import { css } from "@emotion/react";
import { Box, Typography } from "@mui/material";

import { createComponentSlot } from "../../helpers/createComponentSlot";
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

export const VersionTypography = createComponentSlot(Typography)<DiffHeaderClassKey>({
    componentName: "DiffHeader",
    slotName: "versionTypography",
})(() => css``);
export const UserNameTypography = createComponentSlot(Typography)<DiffHeaderClassKey>({
    componentName: "DiffHeader",
    slotName: "userNameTypography",
})(() => css``);

export const DateTypography = createComponentSlot(Typography)<DiffHeaderClassKey>({
    componentName: "DiffHeader",
    slotName: "dateTypography",
})(() => css``);

export const InfoTypography = createComponentSlot(Typography)<DiffHeaderClassKey>({
    componentName: "DiffHeader",
    slotName: "infoTypography",
})(() => css``);

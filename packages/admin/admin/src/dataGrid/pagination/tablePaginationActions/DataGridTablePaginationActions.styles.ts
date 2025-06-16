import { css, Typography } from "@mui/material";

import { createComponentSlot } from "../../../helpers/createComponentSlot";
import type { DataGridTablePaginationActionsClassKey } from "./DataGridTablePaginationActions";

export const Root = createComponentSlot("div")<DataGridTablePaginationActionsClassKey>({
    componentName: "DataGridTablePaginationActions",
    slotName: "root",
})(css`
    display: flex;
    align-items: center;
`);

export const PageOfTypography = createComponentSlot(Typography)<DataGridTablePaginationActionsClassKey>({
    componentName: "DataGridTablePaginationActions",
    slotName: "pageOfTypography",
})(({ theme }) => {
    return css`
        color: ${theme.palette.grey["200"]};
        white-space: nowrap;
    `;
});

export const PreviousNextContainer = createComponentSlot("div")<DataGridTablePaginationActionsClassKey>({
    componentName: "DataGridTablePaginationActions",
    slotName: "previousNextContainer",
})();

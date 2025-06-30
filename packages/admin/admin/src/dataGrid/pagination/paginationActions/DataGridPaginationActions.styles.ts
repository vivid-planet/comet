import { css, Typography } from "@mui/material";

import { createComponentSlot } from "../../../helpers/createComponentSlot";
import type { DataGridPaginationActionsClassKey } from "./DataGridPaginationActions";

export const Root = createComponentSlot("div")<DataGridPaginationActionsClassKey>({
    componentName: "DataGridPaginationActions",
    slotName: "root",
})(css`
    display: flex;
    align-items: center;
`);

export const PageOf = createComponentSlot(Typography)<DataGridPaginationActionsClassKey>({
    componentName: "DataGridPaginationActions",
    slotName: "pageOf",
})(({ theme }) => {
    return css`
        color: ${theme.palette.grey["200"]};
        white-space: nowrap;
    `;
});

export const PreviousNext = createComponentSlot("div")<DataGridPaginationActionsClassKey>({
    componentName: "DataGridPaginationActions",
    slotName: "previousNext",
})();

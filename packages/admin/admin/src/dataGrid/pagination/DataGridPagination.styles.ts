import { css, Typography } from "@mui/material";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { type DataGridPaginationClassKey } from "./DataGridPagination";

export const Root = createComponentSlot("div")<DataGridPaginationClassKey>({
    componentName: "DataGridPagination",
    slotName: "root",
})(css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 12px;
`);

export const PageInformation = createComponentSlot(Typography)<DataGridPaginationClassKey>({
    componentName: "DataGridPagination",
    slotName: "pageInformation",
})();

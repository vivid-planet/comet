import { css, Typography } from "@mui/material";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { type DataGridTablePaginationClassKey } from "./DataGridTablePagination";

export const Root = createComponentSlot("div")<DataGridTablePaginationClassKey>({
    componentName: "DataGridTablePagination",
    slotName: "root",
})(css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 12px;
`);

export const Title = createComponentSlot(Typography)<DataGridTablePaginationClassKey>({
    componentName: "DataGridTablePagination",
    slotName: "title",
})();

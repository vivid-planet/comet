import { TableCellProps } from "@material-ui/core/TableCell";
import * as React from "react";

export interface ITableColumnProps {
    name: string;
    header?: string | React.ReactNode;
    sortable?: boolean;
    cellProps?: TableCellProps;
    headerProps?: TableCellProps;
    children?: (row: any) => React.ReactNode;
}

export const TableColumn: React.FunctionComponent<ITableColumnProps> = () => {
    return null;
};

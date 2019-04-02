import { TableCellProps } from "@material-ui/core/TableCell";
import * as React from "react";

export interface IColumnProps {
    name: string;
    header?: string | React.ReactNode;
    sortable?: boolean;
    cellProps?: TableCellProps;
    headerProps?: TableCellProps;
    children?: (row: any) => React.ReactNode;
}
const Column: React.FunctionComponent<IColumnProps> = () => {
    return null;
};

export default Column;

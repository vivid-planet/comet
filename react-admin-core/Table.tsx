import { IconButton, Toolbar, Typography } from "@material-ui/core";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell, { TableCellProps } from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TableRow, { TableRowProps } from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import * as React from "react";
import ISelectionApi from "./SelectionApi";
import { IColumnProps } from "./table/Column";
import Pagination from "./table/Pagination";
import { IPagingActions } from "./table/pagingStrategy/PagingStrategy";
import TableQueryContext from "./TableQueryContext";
import withTableQueryContext, { IWithTableQueryProps } from "./withTableQueryContext";

interface ITableHeadProps {
    columns: Array<React.ReactElement<IColumnProps> | undefined>;
    renderHeadTableRow?: () => React.ReactElement<TableRowProps>;
    onSortClick: (ev: React.MouseEvent, column: string) => void;
    sort?: string;
    order: "asc" | "desc";
}

const EnhancedTableHead = (props: ITableHeadProps) => {
    const handleSortClick = (name: string, ev: React.MouseEvent) => {
        props.onSortClick(ev, name);
    };

    const tableRow: React.ReactElement<TableRowProps> = props.renderHeadTableRow ? props.renderHeadTableRow() : <TableRow />;
    return (
        <TableHead>
            <tableRow.type {...tableRow.props}>
                {tableRow.props.children}
                {React.Children.map(props.columns, (column: React.ReactElement<IColumnProps>, index) => {
                    if (!column) return null;
                    const { name, header, sortable, headerProps } = column.props;
                    return (
                        <TableCell key={index} {...headerProps}>
                            {sortable ? (
                                <TableSortLabel active={props.sort === name} direction={props.order} onClick={handleSortClick.bind(null, name)}>
                                    {header}
                                </TableSortLabel>
                            ) : (
                                header
                            )}
                        </TableCell>
                    );
                })}
            </tableRow.type>
        </TableHead>
    );
};

interface IRow {
    id: string | number;
}
export interface IProps {
    data: IRow[];
    children: Array<React.ReactElement<IColumnProps> | undefined>;
    totalCount: number;
    selectedId?: string;
    selectable?: boolean;
    sort?: string;
    order?: "asc" | "desc";
    page?: number;
    renderTableRow?: (index: number) => React.ReactElement<TableRowProps>;
    renderHeadTableRow?: () => React.ReactElement<TableRowProps>;
    selectionApi?: ISelectionApi;

    pagingActions?: IPagingActions;
}

class Table extends React.Component<IProps & IWithTableQueryProps> {
    public static contextType = TableQueryContext;
    public render() {
        const { data } = this.props;

        const sort = this.props.sort !== undefined ? this.props.sort : this.context.sort;
        const order = this.props.order !== undefined ? this.props.order : this.context.order;

        return (
            <MuiTable>
                <EnhancedTableHead
                    columns={this.props.children}
                    onSortClick={this.handleSortClick}
                    sort={sort}
                    order={order}
                    renderHeadTableRow={this.props.renderHeadTableRow}
                />
                <TableBody>
                    {data.map((row, index) => {
                        const isSelected = this.isSelected(row.id);
                        const tableRow: React.ReactElement<TableRowProps> = this.props.renderTableRow ? (
                            this.props.renderTableRow(index)
                        ) : (
                            <TableRow />
                        );
                        return (
                            <tableRow.type
                                {...tableRow.props}
                                hover={this.props.selectable}
                                onClick={this.handleClick.bind(this, row.id)}
                                role="checkbox"
                                aria-checked={isSelected}
                                tabIndex={-1}
                                key={row.id}
                                selected={isSelected}
                                id={String(row.id)}
                                onKeyDown={this.handleKeyDown}
                            >
                                {tableRow.props.children}
                                {React.Children.map(this.props.children, (column: React.ReactElement<IColumnProps>, colIndex) => {
                                    if (!column) return null;
                                    return (
                                        <TableCell key={colIndex} {...column.props.cellProps}>
                                            {column.props.children ? column.props.children(row) : (row as any)[column.props.name]}
                                        </TableCell>
                                    );
                                })}
                            </tableRow.type>
                        );
                    })}
                </TableBody>
                {this.props.pagingActions && (
                    <TableFooter>
                        <TableRow>
                            <Pagination totalCount={this.props.totalCount} pagingActions={this.props.pagingActions} />
                        </TableRow>
                    </TableFooter>
                )}
            </MuiTable>
        );
    }

    private handleClick = (id: string, event: React.MouseEvent) => {
        if (this.props.selectable && this.props.selectionApi) {
            this.props.selectionApi.handleSelectId(id);
        }
    };

    private handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            if (this.props.selectable && this.props.selectionApi) {
                const selectedIndex = this.props.data.findIndex(i => String(this.props.selectedId) === String(i.id));
                if (selectedIndex !== -1) {
                    const nextSelectedIndex = event.key === "ArrowDown" ? selectedIndex + 1 : selectedIndex - 1;
                    if (this.props.data[nextSelectedIndex]) {
                        this.props.selectionApi.handleSelectId(String(this.props.data[nextSelectedIndex].id));
                    }
                }
                event.preventDefault();
            }
        }
    };

    private isSelected(id: string | number) {
        return String(this.props.selectedId) === String(id); //  as strings as selectedId might come from url
    }

    private handleSortClick(event: React.MouseEvent, name: string) {
        if (this.props.tableQuery) {
            this.props.tableQuery.api.changeSort(name);
        }
    }
}

const ExtendedTable = withTableQueryContext(Table);

export default ExtendedTable;

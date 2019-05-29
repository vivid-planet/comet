import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell, { TableCellProps } from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow, { TableRowProps } from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import * as React from "react";
import { ISelectionApi } from "../SelectionApi";
import { TablePagination } from "./Pagination";
import { IPagingActions } from "./pagingStrategy";
import * as sc from "./Table.sc";
import { TableQueryContext } from "./TableQueryContext";

interface ITableHeadProps<TRow extends IRow> {
    columns: Array<ITableColumn<TRow>>;
    renderHeadTableRow?: () => React.ReactElement<TableRowProps>;
    onSortClick: (ev: React.MouseEvent, column: string) => void;
    sort?: string;
    order: "asc" | "desc";
}

function EnhancedTableHead<TRow extends IRow>(props: ITableHeadProps<TRow>) {
    const handleSortClick = (name: string, ev: React.MouseEvent) => {
        props.onSortClick(ev, name);
    };

    const tableRow: React.ReactElement<TableRowProps> = props.renderHeadTableRow ? props.renderHeadTableRow() : <TableRow />;
    return (
        <sc.StyledTableHead>
            <tableRow.type {...tableRow.props}>
                {tableRow.props.children}
                {props.columns.map((column, index) => {
                    if (column.visible === false) return null;
                    const { name, header, sortable, headerProps } = column;
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
        </sc.StyledTableHead>
    );
}

export interface IRow {
    id: string | number;
}
interface ITableColumn<TRow extends IRow> {
    name: string;
    visible?: boolean;
    header?: string | React.ReactNode;
    render?: (row: TRow) => React.ReactNode;
    sortable?: boolean;
    cellProps?: TableCellProps;
    headerProps?: TableCellProps;
}
export interface ITableProps<TRow extends IRow> {
    data: TRow[];
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
    rowName?: string | ((count: number) => string);
    hideTableHead?: boolean;
    columns: Array<ITableColumn<TRow>>;
}

export class Table<TRow extends IRow> extends React.Component<ITableProps<TRow>> {
    public static contextType = TableQueryContext;
    public render() {
        const { data } = this.props;

        const sort = this.props.sort !== undefined ? this.props.sort : this.context.sort;
        const order = this.props.order !== undefined ? this.props.order : this.context.order;

        return (
            <MuiTable>
                {!this.props.hideTableHead && (
                    <EnhancedTableHead
                        columns={this.props.columns}
                        onSortClick={this.handleSortClick}
                        sort={sort}
                        order={order}
                        renderHeadTableRow={this.props.renderHeadTableRow}
                    />
                )}
                <TableBody>
                    {data.map((row, index) => {
                        const isSelected = this.isSelected(row.id);
                        const tableRow: React.ReactElement<TableRowProps> = this.props.renderTableRow ? (
                            this.props.renderTableRow(index)
                        ) : (
                            <sc.StyledTableBodyRow hideTableHead={!!this.props.hideTableHead} />
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
                                {/*tableRow.props.columns*/}
                                {this.props.columns.map((column, colIndex) => {
                                    if (column.visible === false) return null;
                                    return (
                                        <TableCell key={colIndex} {...column.cellProps}>
                                            {column.render ? column.render(row) : (row as any)[column.name]}
                                        </TableCell>
                                    );
                                })}
                            </tableRow.type>
                        );
                    })}
                </TableBody>
                {this.props.pagingActions && (
                    <TableFooter>
                        <sc.StyledTableBodyRow hideTableHead={!!this.props.hideTableHead}>
                            <TablePagination
                                totalCount={this.props.totalCount}
                                pagingActions={this.props.pagingActions}
                                rowName={this.props.rowName}
                            />
                        </sc.StyledTableBodyRow>
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
        if (this.context) {
            this.context.api.changeSort(name);
        }
    }
}

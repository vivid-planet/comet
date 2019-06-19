import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell, { TableCellProps } from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import * as React from "react";
import { ISelectionApi } from "../SelectionApi";
import { TablePagination } from "./Pagination";
import { IPagingInfo } from "./pagingStrategy";
import * as sc from "./Table.sc";
import { TableQueryContext } from "./TableQueryContext";

export function TableBodyRow({ innerRef, ...props }: sc.ITableBodyRowProps) {
    return <sc.TableBodyRow {...props} />;
}
export interface ITableHeadRowProps<TRow extends IRow> extends ITableHeadColumnsProps<TRow> {}
function DefaultHeadTableRow<TRow extends IRow>({ columns, sort, order, onSortClick }: ITableHeadRowProps<TRow>) {
    return (
        <TableRow>
            <TableHeadColumns columns={columns} sort={sort} order={order} onSortClick={onSortClick} />
        </TableRow>
    );
}

export interface ITableHeadColumnsProps<TRow extends IRow> {
    columns: Array<ITableColumn<TRow>>;
    sort: string;
    order: "asc" | "desc";
    onSortClick: (ev: React.MouseEvent, column: string) => void;
}
// render default TableCell fragments for given columns
export function TableHeadColumns<TRow extends IRow>({ columns, sort, order, onSortClick }: ITableHeadColumnsProps<TRow>) {
    const handleSortClick = (name: string, ev: React.MouseEvent) => {
        onSortClick(ev, name);
    };

    return (
        <>
            {columns.map((column: any, colIndex: number) => {
                if (column.visible === false) return null;
                const { name, header, sortable, headerProps } = column;
                return (
                    <TableCell key={colIndex} {...headerProps}>
                        {sortable ? (
                            <TableSortLabel active={sort === name} direction={order} onClick={handleSortClick.bind(null, name)}>
                                {header}
                            </TableSortLabel>
                        ) : (
                            header
                        )}
                    </TableCell>
                );
            })}
        </>
    );
}

export interface ITableColumnsProps<TRow extends IRow> {
    row: TRow;
    columns: Array<ITableColumn<TRow>>;
}
// render default TableCell fragments for given columns
export function TableColumns<TRow extends IRow>({ row, columns }: ITableColumnsProps<TRow>) {
    return (
        <>
            {columns.map((column: any, colIndex: number) => {
                if (column.visible === false) return null;
                return (
                    <TableCell key={colIndex} {...column.cellProps}>
                        {column.render ? column.render(row) : (row as any)[column.name]}
                    </TableCell>
                );
            })}
        </>
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

export interface ITableRowProps<TRow extends IRow> extends ITableColumnsProps<TRow> {
    index: number;
    key: any;
    rowProps: sc.ITableBodyRowProps;
}

export interface ITableProps<TRow extends IRow> {
    data: TRow[];
    totalCount: number;
    currentPage?: number;
    selectedId?: string;
    selectable?: boolean;
    sort?: string;
    order?: "asc" | "desc";
    page?: number;
    renderTableRow?: (props: ITableRowProps<TRow>) => React.ReactNode;
    renderHeadTableRow?: (props: ITableHeadRowProps<TRow>) => React.ReactNode;
    selectionApi?: ISelectionApi;
    pagingInfo?: IPagingInfo;
    rowName?: string | ((count: number) => string);
    hideTableHead?: boolean;
    columns: Array<ITableColumn<TRow>>;
}

function DefaultTableRow<TRow extends IRow>({ columns, row, rowProps }: ITableRowProps<TRow>) {
    return (
        <TableBodyRow {...rowProps}>
            <TableColumns columns={columns} row={row} />
        </TableBodyRow>
    );
}

export class Table<TRow extends IRow> extends React.Component<ITableProps<TRow>> {
    public static contextType = TableQueryContext;
    public render() {
        const { data } = this.props;

        const sort = this.props.sort !== undefined ? this.props.sort : this.context.sort;
        const order = this.props.order !== undefined ? this.props.order : this.context.order;

        const renderHeadTableRow = this.props.renderHeadTableRow || (props => <DefaultHeadTableRow {...props} />);

        return (
            <MuiTable>
                {!this.props.hideTableHead && (
                    <sc.StyledTableHead>
                        {renderHeadTableRow({
                            columns: this.props.columns,
                            onSortClick: this.handleSortClick,
                            sort,
                            order,
                        })}
                    </sc.StyledTableHead>
                )}
                <TableBody>
                    {data.map((row, index) => {
                        const isSelected = this.isSelected(row.id);
                        const renderTableRow = this.props.renderTableRow || (props => <DefaultTableRow {...props} />);
                        return renderTableRow({
                            index,
                            row,
                            columns: this.props.columns,
                            key: row.id,
                            rowProps: {
                                hover: this.props.selectable,
                                onClick: this.handleClick.bind(this, row.id),
                                role: "checkbox",
                                tabIndex: -1,
                                selected: isSelected,
                                onKeyDown: this.handleKeyDown,
                                index,
                                hideTableHead: !!this.props.hideTableHead,
                            },
                        });
                    })}
                </TableBody>
                {this.props.pagingInfo && (
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                totalCount={this.props.totalCount}
                                currentPage={this.props.currentPage}
                                pagingInfo={this.props.pagingInfo}
                                rowName={this.props.rowName}
                            />
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
        if (this.context) {
            this.context.api.changeSort(name);
        }
    }
}

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
import Pagination from "./table/Pagination";
import TableQueryContext from "./TableQueryContext";
import withTableQueryContext, { IWithTableQueryProps } from "./withTableQueryContext";

interface ITableHeadProps {
    columns: IColumn[];
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
                {props.columns.map(({ name, header, sortable, headerProps }, index) => (
                    <TableCell key={index} {...headerProps}>
                        {sortable ? (
                            <TableSortLabel active={props.sort === name} direction={props.order} onClick={handleSortClick.bind(null, name)}>
                                {header}
                            </TableSortLabel>
                        ) : (
                            header
                        )}
                    </TableCell>
                ))}
            </tableRow.type>
        </TableHead>
    );
};

interface IColumn {
    name: string;
    header?: string | React.ReactNode;
    cell?: (row: any) => React.ReactNode;
    sortable?: boolean;
    cellProps?: TableCellProps;
    headerProps?: TableCellProps;
}
interface IRow {
    id: string | number;
}
export interface IProps {
    data: IRow[];
    columns: IColumn[];
    total: number;
    selectedId?: string;
    selectable?: boolean;
    sort?: string;
    order?: "asc" | "desc";
    page?: number;
    renderTableRow?: (index: number) => React.ReactElement<TableRowProps>;
    renderHeadTableRow?: () => React.ReactElement<TableRowProps>;
    selectionApi?: ISelectionApi;
    hasPrevious?: boolean;
    hasNext?: boolean;
    rowName?: string | { plural: string; singular: string };
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
                    columns={this.props.columns}
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
                                {this.props.columns.map((column, colIndex) => (
                                    <TableCell key={colIndex} {...column.cellProps}>
                                        {column.cell ? column.cell(row) : (row as any)[column.name]}
                                    </TableCell>
                                ))}
                            </tableRow.type>
                        );
                    })}
                </TableBody>
                {this.props.hasNext !== undefined && this.props.hasPrevious !== undefined && (
                    <TableFooter>
                        <TableRow>
                            <Pagination
                                total={this.props.total}
                                hasNext={this.props.hasNext}
                                hasPrevious={this.props.hasPrevious}
                                onBackClick={this.handleBackButtonClick}
                                onNextClick={this.handleNextButtonClick}
                                rowName={this.props.rowName}
                            />
                        </TableRow>
                    </TableFooter>
                )}
            </MuiTable>
        );
    }

    private handleBackButtonClick = () => {
        if (this.props.tableQuery) {
            const page = this.props.page !== undefined ? this.props.page : this.context.page;
            this.props.tableQuery.api.changePage(page - 1);
        }
    };
    private handleNextButtonClick = () => {
        if (this.props.tableQuery) {
            const page = this.props.page !== undefined ? this.props.page : this.context.page;
            this.props.tableQuery.api.changePage(page + 1);
        }
    };

    private handleChangePage = (ev: React.MouseEvent | null, newPage: number) => {
        if (this.props.tableQuery) {
            this.props.tableQuery.api.changePage(newPage);
        }
    };

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

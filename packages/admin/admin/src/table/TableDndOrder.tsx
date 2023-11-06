import { DragHandle } from "@comet/admin-icons";
import { Theme } from "@mui/material";
import { ComponentsOverrides } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { ClassKeyOfStyles, ClassNameMap, createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";
import { DropTargetMonitor, useDrag, useDrop, XYCoord } from "react-dnd";

import { IRow, ITableProps, ITableRowProps, Table, TableColumns, TableHeadColumns } from "./Table";
import { TableBodyRow } from "./TableBodyRow";

interface IDndOrderRowProps<TRow extends IRow> extends ITableRowProps<TRow> {
    moveRow: (dragIndex: number, hoverIndex: number) => void;
    onDragEnd?: () => void;
    dragHandleIcon: React.ReactNode;
    classes: ClassNameMap<ClassKeyOfStyles<typeof styles>>;
}

interface DragItem {
    index: number;
    id: string;
}

function DndOrderRow<TRow extends IRow>(props: IDndOrderRowProps<TRow>) {
    const { columns, row, rowProps, classes } = props;

    const refDragHandle = React.useRef<HTMLTableCellElement>(null);
    const refRow = React.useRef<HTMLTableRowElement>(null);

    const [{ isDragging }, drag, dragPreview] = useDrag({
        type: "row", // TODO: configurable? unique per table?
        item: () =>
            ({
                id: props.row.id,
                index: props.index,
            } as DragItem),
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
        end: () => {
            if (props.onDragEnd) {
                props.onDragEnd();
            }
        },
    });

    const [, drop] = useDrop({
        accept: "row",
        hover(item: DragItem, monitor: DropTargetMonitor) {
            // SOURCE for this code: https://codesandbox.io/s/github/react-dnd/react-dnd/tree/gh-pages/examples_hooks_ts/04-sortable/simple

            if (!refRow.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = props.index;

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }

            // Determine rectangle on screen
            const hoverBoundingRect = refRow.current?.getBoundingClientRect();

            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            // Determine mouse position
            const clientOffset = monitor.getClientOffset();

            // Get pixels to the top
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            // Time to actually perform the action
            props.moveRow(dragIndex, hoverIndex);

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
    });

    const opacity = isDragging ? 0 : 1;

    drag(refDragHandle);
    drop(dragPreview(refRow));

    return (
        <TableBodyRow ref={refRow} {...rowProps} style={{ opacity }}>
            <TableCell ref={refDragHandle} className={classes.dragCell}>
                <div className={classes.dragIconContainer}>{props.dragHandleIcon}</div>
            </TableCell>
            <TableColumns columns={columns} row={row} />
        </TableBodyRow>
    );
}

interface TableDndOrderProps<TRow extends IRow> extends ITableProps<TRow> {
    moveRow: (dragIndex: number, hoverIndex: number) => void;
    onDragEnd?: () => void;
    dragHandleIcon?: React.ReactNode;
}

function TableDndOrder<TRow extends IRow>({
    moveRow,
    onDragEnd,
    dragHandleIcon = <DragHandle />,
    classes,
    ...rest
}: TableDndOrderProps<TRow> & WithStyles<typeof styles>): JSX.Element {
    const renderHeadTableRow = React.useCallback<NonNullable<ITableProps<TRow>["renderHeadTableRow"]>>((ownProps) => {
        return (
            <TableRow>
                <TableCell />
                <TableHeadColumns {...ownProps} />
            </TableRow>
        );
    }, []);
    const renderTableRow = React.useCallback<NonNullable<ITableProps<TRow>["renderTableRow"]>>(
        (ownProps) => {
            return <DndOrderRow moveRow={moveRow} onDragEnd={onDragEnd} dragHandleIcon={dragHandleIcon} classes={classes} {...ownProps} />;
        },
        [moveRow, onDragEnd, dragHandleIcon, classes],
    );

    const tableProps: ITableProps<TRow> = {
        ...rest,
        renderTableRow,
        renderHeadTableRow,
    };

    return <Table className={classes.root} {...tableProps} />;
}

export type TableDndOrderClassKey = "root" | "dragCell" | "dragIconContainer";

const styles = () =>
    createStyles<TableDndOrderClassKey, TableDndOrderProps<IRow>>({
        root: {},
        dragCell: {
            cursor: "grab",
            width: 20,
            paddingRight: 0,
        },
        dragIconContainer: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            "&:after": {
                // Increase clickable area to include the padding-left of the next cell.
                content: '""',
                position: "absolute",
                zIndex: 1,
                top: 0,
                right: -20,
                bottom: 0,
                left: 0,
            },
        },
    });

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
const TableDndOrderWithStyles = withStyles(styles, { name: "CometAdminTableDndOrder" })(TableDndOrder);
export { TableDndOrderWithStyles as TableDndOrder };

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminTableDndOrder: Partial<TableDndOrderProps<IRow>>;
    }

    interface ComponentNameToClassKey {
        CometAdminTableDndOrder: TableDndOrderClassKey;
    }

    interface Components {
        CometAdminTableDndOrder?: {
            defaultProps?: ComponentsPropsList["CometAdminTableDndOrder"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminTableDndOrder"];
        };
    }
}

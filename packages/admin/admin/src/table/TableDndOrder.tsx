import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import * as React from "react";
import { DropTargetMonitor, useDrag, useDrop, XYCoord } from "react-dnd";

import { IRow, ITableProps, ITableRowProps, Table, TableColumns, TableHeadColumns } from "./Table";
import { TableBodyRow } from "./TableBodyRow";

interface IDndOrderRowProps<TRow extends IRow> extends ITableRowProps<TRow> {
    moveRow: (dragIndex: number, hoverIndex: number) => void;
    onDragEnd?: () => void;
}

interface DragItem {
    index: number;
    id: string;
}

function DndOrderRow<TRow extends IRow>(props: IDndOrderRowProps<TRow>) {
    const { columns, row, rowProps } = props;

    const refDragHandle = React.useRef<HTMLSpanElement>(null);
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
            <TableCell>
                <span ref={refDragHandle} style={{ padding: 5, cursor: "grab" }}>
                    ::
                </span>
            </TableCell>
            <TableColumns columns={columns} row={row} />
        </TableBodyRow>
    );
}

interface IProps<TRow extends IRow> extends ITableProps<TRow> {
    moveRow: (dragIndex: number, hoverIndex: number) => void;
    onDragEnd?: () => void;
}

export function TableDndOrder<TRow extends IRow>({ moveRow, onDragEnd, ...rest }: IProps<TRow>): JSX.Element {
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
            return <DndOrderRow moveRow={moveRow} onDragEnd={onDragEnd} {...ownProps} />;
        },
        [moveRow, onDragEnd],
    );

    const tableProps: ITableProps<TRow> = {
        ...rest,
        renderTableRow,
        renderHeadTableRow,
    };

    return <Table {...tableProps} />;
}

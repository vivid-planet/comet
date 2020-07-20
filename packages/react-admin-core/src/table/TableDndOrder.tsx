import RootRef from "@material-ui/core/RootRef";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import * as React from "react";
import { ConnectDragPreview, ConnectDragSource, ConnectDropTarget, DragDropContext, DragSource, DropTarget, DropTargetMonitor } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { findDOMNode } from "react-dom";
import { IRow, ITableProps, ITableRowProps, Table, TableBodyRow, TableColumns, TableHeadColumns } from "./Table";

function cardSourceBeginDrag<TRow extends IRow>(props: IDndOrderRowProps<TRow>) {
    return {
        id: props.row.id,
        index: props.index,
    };
}

function cardTargetHover<TRow extends IRow>(props: IDndOrderRowProps<TRow>, monitor: DropTargetMonitor, component: DndOrderRow<TRow>): void {
    // SOURCE for this code: https://github.com/react-dnd/react-dnd/tree/master/packages/documentation/examples/04%20Sortable/Simple

    if (!component) {
        return;
    }

    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    if (hoverIndex === undefined) return;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
        return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = (findDOMNode(component) as any).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    if (!clientOffset) return;

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

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
    monitor.getItem().index = hoverIndex;
}

interface IDndOrderRowProps<TRow extends IRow> extends ITableRowProps<TRow> {
    moveRow: (dragIndex: number, hoverIndex: number) => void;
    onDragEnd?: () => void;
}

interface IRowCollectedSourceProps {
    connectDragSource: ConnectDragSource;
    connectDragPreview: ConnectDragPreview;
    isDragging: boolean;
}
interface IRowCollectedTargetProps {
    connectDropTarget: ConnectDropTarget;
}
class DndOrderRow<TRow extends IRow> extends React.Component<IDndOrderRowProps<TRow> & IRowCollectedSourceProps & IRowCollectedTargetProps> {
    public render() {
        const { connectDragSource, isDragging, columns, row, rowProps } = this.props;
        const opacity = isDragging ? 0 : 1;
        return (
            <RootRef rootRef={this.handleRootRef}>
                <TableBodyRow {...rowProps} style={{ opacity }}>
                    <TableCell>{connectDragSource(<span style={{ padding: 5, cursor: "grab" }}>::</span>)}</TableCell>
                    <TableColumns columns={columns} row={row} />
                </TableBodyRow>
            </RootRef>
        );
    }

    private handleRootRef = (instance: any) => {
        const { connectDropTarget, connectDragPreview } = this.props;
        connectDropTarget(instance);
        connectDragPreview(instance);
    };
}

const ExtendedDndOrderRow = DragSource<IDndOrderRowProps<IRow>, IRowCollectedSourceProps>(
    "row", // TODO: configurable? unique per table?
    {
        beginDrag: cardSourceBeginDrag,
        endDrag: props => {
            if (props.onDragEnd) {
                props.onDragEnd();
            }
        },
    },
    (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging(),
    }),
)(
    DropTarget<{}, IRowCollectedTargetProps>(
        "row",
        {
            hover: cardTargetHover,
        },
        connect => ({
            connectDropTarget: connect.dropTarget(),
        }),
    )(DndOrderRow),
);

interface IProps<TRow extends IRow> extends ITableProps<TRow> {
    moveRow: (dragIndex: number, hoverIndex: number) => void;
    onDragEnd?: () => void;
}

// tslint:disable-next-line:max-classes-per-file
class TableDndOrder<TRow extends IRow> extends React.Component<IProps<TRow>> {
    public render() {
        const tableProps: ITableProps<TRow> = {
            ...this.props,
            renderTableRow: props => {
                return <ExtendedDndOrderRow moveRow={this.props.moveRow} onDragEnd={this.props.onDragEnd} index={props.index} {...props} />;
            },
            renderHeadTableRow: props => {
                return (
                    <TableRow>
                        <TableCell />
                        <TableHeadColumns {...props} />
                    </TableRow>
                );
            },
        };
        return <Table {...tableProps} />;
    }
}
const WrappedTableDndOrder = DragDropContext(HTML5Backend)(TableDndOrder);
export { WrappedTableDndOrder as TableDndOrder };

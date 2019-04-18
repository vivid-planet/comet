import RootRef from "@material-ui/core/RootRef";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import * as React from "react";
import { ConnectDragPreview, ConnectDragSource, ConnectDropTarget, DragDropContext, DragSource, DropTarget, DropTargetMonitor } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { findDOMNode } from "react-dom";
import { ExtendedTable, ITableProps } from "./Table";

const cardSource = {
    beginDrag(props: IRowProps) {
        return {
            id: props.id,
            index: props.index,
        };
    },
};

const cardTarget = {
    hover(props: IRowProps, monitor: DropTargetMonitor, component: DndOrderRow): void {
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
    },
};

interface IRowProps {
    id?: string;
    index?: number;
    moveRow: (dragIndex: number, hoverIndex: number) => void;
}

interface IRowCollectedProps {
    connectDropTarget: ConnectDropTarget;
    connectDragSource: ConnectDragSource;
    connectDragPreview: ConnectDragPreview;
    isDragging: boolean;
}
class DndOrderRow extends React.Component<IRowProps & IRowCollectedProps> {
    public render() {
        const { connectDropTarget, connectDragSource, connectDragPreview, isDragging, moveRow, ...rest } = this.props;
        const opacity = isDragging ? 0 : 1;
        return (
            <RootRef rootRef={this.handleRootRef}>
                <TableRow {...rest} style={{ opacity }}>
                    <TableCell>{connectDragSource(<span style={{ padding: 5 }}>::</span>)}</TableCell>
                    {this.props.children}
                </TableRow>
            </RootRef>
        );
    }

    private handleRootRef = (instance: any) => {
        const { connectDropTarget, connectDragPreview } = this.props;
        connectDropTarget(instance);
        connectDragPreview(instance);
    };
}

const ExtendedDndOrderRow = DragSource(
    "row", // TODO: configurable? unique per table?
    cardSource,
    (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging(),
    }),
)(
    DropTarget("row", cardTarget, connect => ({
        connectDropTarget: connect.dropTarget(),
    }))(DndOrderRow),
);

interface IProps extends ITableProps {
    moveRow: (dragIndex: number, hoverIndex: number) => void;
}
// tslint:disable-next-line:max-classes-per-file
class TableDndOrder extends React.Component<IProps> {
    public render() {
        const props = {
            ...this.props,
            renderTableRow: (index: number) => {
                return <ExtendedDndOrderRow moveRow={this.props.moveRow} index={index} />;
            },
            renderHeadTableRow: () => {
                return (
                    <TableRow>
                        <TableCell />
                    </TableRow>
                );
            },
        };
        return <ExtendedTable {...props} />;
    }
}
const WrappedTableDndOrder = DragDropContext(HTML5Backend)(TableDndOrder);
export { WrappedTableDndOrder as TableDndOrder };

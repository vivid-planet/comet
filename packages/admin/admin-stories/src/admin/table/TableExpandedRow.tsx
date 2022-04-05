import { ITableHeadRowProps, ITableRowProps, Table, TableBodyRow, TableColumns, TableHeadColumns } from "@comet/admin";
import { Add as AddIcon } from "@mui/icons-material";
import { IconButton, TableCell } from "@mui/material";
import TableRow from "@mui/material/TableRow";
import { storiesOf } from "@storybook/react";
import * as React from "react";

interface IRow {
    id: number;
    foo1: string;
    foo2: string;
}

function ExpandableTableRow({ rowProps, ...rest }: ITableRowProps<IRow>) {
    const [isExpanded, setIsExpanded] = React.useState(false);
    return (
        <>
            <TableBodyRow {...rowProps}>
                <TableColumns {...rest} />
                <TableCell>
                    <IconButton
                        onClick={() => {
                            setIsExpanded(!isExpanded);
                        }}
                        size="large"
                    >
                        <AddIcon />
                    </IconButton>
                </TableCell>
            </TableBodyRow>
            {isExpanded && (
                <TableBodyRow index={rowProps.index}>
                    <TableCell colSpan={999}>Deeetails</TableCell>
                </TableBodyRow>
            )}
        </>
    );
}

function ExampleHeadTableRow<TRow extends IRow>(props: ITableHeadRowProps<TRow>) {
    return (
        <TableRow>
            <TableHeadColumns {...props} />
            <TableCell />
        </TableRow>
    );
}

function Story() {
    const data: IRow[] = [
        { id: 1, foo1: "blub", foo2: "blub" },
        { id: 2, foo1: "blub", foo2: "blub" },
    ];

    return (
        <Table
            data={data}
            totalCount={data.length}
            renderTableRow={(props) => <ExpandableTableRow {...props} />}
            renderHeadTableRow={(props) => <ExampleHeadTableRow {...props} />}
            columns={[
                {
                    name: "foo1",
                    header: "Foo1",
                },
                {
                    name: "foo2",
                    header: "Foo2",
                    render: (row) => <strong>{row.id}</strong>,
                },
                {
                    name: "bar",
                    visible: false,
                },
            ]}
        />
    );
}

storiesOf("@comet/admin/table", module).add("Expanded Row", () => <Story />);

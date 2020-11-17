import { TableCell } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import { ITableRowProps, Table, TableBodyRow, TableColumns } from "@vivid-planet/react-admin";
import * as React from "react";

// TODO this might be useful in it's own package
function useWindowSize() {
    function getSize() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
        };
    }

    const [windowSize, setWindowSize] = React.useState(getSize);

    React.useEffect(() => {
        function handleResize() {
            setWindowSize(getSize());
        }

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return windowSize;
}

function ExampleTableRow({ columns, row, showSecondRow, rowProps }: ITableRowProps<IExampleRow> & { showSecondRow: boolean }) {
    return (
        <>
            <TableBodyRow {...rowProps}>
                <TableColumns columns={columns} row={row} />
            </TableBodyRow>
            {showSecondRow && (
                <TableBodyRow index={rowProps.index}>
                    <TableCell colSpan={3}>Bar: {row.bar}</TableCell>
                </TableBodyRow>
            )}
        </>
    );
}

interface IExampleRow {
    id: number;
    foo1: string;
    foo2: string;
    bar: string;
}

function Story() {
    const { width } = useWindowSize();
    const showSecondRow = width < 1024;

    const data: IExampleRow[] = [
        { id: 1, foo1: "blub", foo2: "blub", bar: "barr" },
        { id: 2, foo1: "blub", foo2: "blub", bar: "barr" },
    ];
    return (
        <Table
            data={data}
            totalCount={data.length}
            renderTableRow={(props) => <ExampleTableRow {...props} showSecondRow={showSecondRow} />}
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
                    header: "Bar",
                    visible: !showSecondRow,
                },
            ]}
        />
    );
}

storiesOf("react-admin", module).add("Table Responsive", () => <Story />);

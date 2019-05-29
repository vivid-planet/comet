import { TableCell, TableRow } from "@material-ui/core";
import { ITableRowProps, Table, TableColumns } from "@vivid-planet/react-admin-core";
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
            <TableRow {...rowProps}>
                <TableColumns columns={columns} row={row} />
            </TableRow>
            {showSecondRow && (
                <TableRow>
                    <TableCell colSpan={3}>Bar: {row.bar}</TableCell>
                </TableRow>
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
export default function App() {
    const { width } = useWindowSize();
    const showSecondRow = width < 1024;

    const data: IExampleRow[] = [{ id: 1, foo1: "blub", foo2: "blub", bar: "barr" }, { id: 2, foo1: "blub", foo2: "blub", bar: "barr" }];
    return (
        <Table
            data={data}
            totalCount={data.length}
            sort="foo1"
            order="asc"
            renderTableRow={props => <ExampleTableRow {...props} showSecondRow={showSecondRow} />}
            columns={[
                {
                    name: "foo1",
                    header: "Foo1",
                },
                {
                    name: "foo2",
                    header: "Foo2",
                    render: row => <strong>{row.id}</strong>,
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

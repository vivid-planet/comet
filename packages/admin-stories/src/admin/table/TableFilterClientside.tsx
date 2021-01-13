import { Field, FieldContainerLabelAbove, FinalFormInput, Table, TableFilterFinalForm, useTableQueryFilter } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";

interface IExampleRow {
    id: number;
    foo1: string;
    foo2: string;
}
interface IFilterValues {
    query?: string;
}

function Story() {
    const data: IExampleRow[] = [
        { id: 1, foo1: "blub1", foo2: "blub2" },
        { id: 2, foo1: "blub2", foo2: "blub1" },
    ];

    const filterApi = useTableQueryFilter<IFilterValues>({});

    const filteredData = data.filter((i) => filterApi.current.query === undefined || i.foo1.includes(filterApi.current.query));
    return (
        <>
            <TableFilterFinalForm filterApi={filterApi}>
                <Field
                    name="query"
                    type="text"
                    label="Query"
                    component={FinalFormInput}
                    fullWidth
                    fieldContainerComponent={FieldContainerLabelAbove}
                />
            </TableFilterFinalForm>
            <Table
                data={filteredData}
                totalCount={data.length}
                columns={[
                    {
                        name: "foo1",
                        header: "Foo1",
                        sortable: true,
                    },
                    {
                        name: "foo2",
                        header: "Foo2",
                        render: (row) => <strong>{row.id}</strong>,
                        sortable: true,
                    },
                    {
                        name: "bar",
                        visible: false,
                    },
                ]}
            />
        </>
    );
}

storiesOf("@comet/admin/table", module).add("Filter Clientside", () => <Story />);

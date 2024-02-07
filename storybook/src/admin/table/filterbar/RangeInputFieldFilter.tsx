import { Field, FilterBar, FilterBarPopoverFilter, FinalFormRangeInput, Table, TableFilterFinalForm, useTableQueryFilter } from "@comet/admin";
import { Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import faker from "faker";
import * as React from "react";

interface IFilterValues {
    horsepower: {
        min: number;
        max: number;
    };
}

interface IExampleRow {
    id: number;
    horsepower: number;
}

interface StoryProps {
    tableData: IExampleRow[];
}

function Story({ tableData }: StoryProps) {
    const filterApi = useTableQueryFilter<Partial<IFilterValues>>({
        horsepower: {
            min: 50,
            max: 200,
        },
    });

    const filteredData = tableData.filter(
        (item) =>
            filterApi.current.horsepower === undefined ||
            (item.horsepower > filterApi.current.horsepower?.min && item.horsepower < filterApi.current.horsepower?.max),
    );

    return (
        <>
            <TableFilterFinalForm filterApi={filterApi}>
                <Typography variant="h5">FilterBar</Typography>
                <FilterBar>
                    <FilterBarPopoverFilter label="Horsepower">
                        <Field label="Horsepower:" name="horsepower" component={FinalFormRangeInput} fullWidth min={50} max={200} />
                    </FilterBarPopoverFilter>
                </FilterBar>
            </TableFilterFinalForm>
            Filters: {JSON.stringify(filterApi.current)}
            <Table
                data={filteredData}
                totalCount={filteredData.length}
                columns={[
                    {
                        name: "horsepower",
                        header: "Horsepower",
                    },
                ]}
            />
        </>
    );
}

storiesOf("@comet/admin/table/filterbar", module).add("Filterbar with Range Input Field Filter", () => {
    const randomTableData = Array.from(Array(30).keys()).map((i): IExampleRow => {
        return {
            id: i,
            horsepower: faker.datatype.number({ min: 50, max: 200 }),
        };
    });
    return <Story tableData={randomTableData} />;
});

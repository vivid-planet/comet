import { Field, FilterBar, FilterBarSingleSelect, Table, TableFilterFinalForm, useTableQueryFilter } from "@comet/admin";
import { MenuItem, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import faker from "faker";
import * as React from "react";
import { FormattedMessage } from "react-intl";

enum SortDirection {
    ASC = "ASC",
    DESC = "DESC",
}
interface SortInformation {
    columnName: "price" | "horsepower";
    direction: SortDirection;
}
type Sorting = {
    id: string;
    sortInfo: SortInformation;
    label: React.ReactNode;
};

const sortings: Sorting[] = [
    {
        id: "priceASC",
        sortInfo: {
            columnName: "price",
            direction: SortDirection.ASC,
        },
        label: <FormattedMessage id="comet.pages.dam.filename" defaultMessage="Price ASC" />,
    },
    {
        id: "priceDESC",
        sortInfo: {
            columnName: "price",
            direction: SortDirection.DESC,
        },
        label: <FormattedMessage id="comet.pages.dam.filename" defaultMessage="Price DESC" />,
    },
    {
        id: "horsepowerASC",
        sortInfo: {
            columnName: "horsepower",
            direction: SortDirection.ASC,
        },
        label: <FormattedMessage id="comet.pages.dam.changeDate" defaultMessage="Horsepower ASC" />,
    },
    {
        id: "horsepowerDESC",
        sortInfo: {
            columnName: "horsepower",
            direction: SortDirection.DESC,
        },
        label: <FormattedMessage id="comet.pages.dam.changeDate" defaultMessage="Horsepower DESC" />,
    },
];

interface FilterValues {
    sortingId: string;
}

interface ExampleRow {
    id: number;
    model: string;
    horsepower: number;
    price: number;
}

interface StoryProps {
    tableData: ExampleRow[];
}

function Story({ tableData }: StoryProps) {
    const filterApi = useTableQueryFilter<Partial<FilterValues>>({
        sortingId: sortings[0].id,
    });

    const sortedBy = sortings.find((sorting) => {
        return filterApi.current.sortingId === sorting.id;
    });

    const filteredData = tableData.sort((item1, item2) => {
        const column = sortedBy?.sortInfo.columnName;
        const direction = sortedBy?.sortInfo.direction;

        if (column && direction) {
            return direction === SortDirection.ASC ? item1[column] - item2[column] : item2[column] - item1[column];
        }

        return 0;
    });

    return (
        <>
            <TableFilterFinalForm<Partial<FilterValues>>
                filterApi={filterApi}
                onSubmit={(values) => {
                    const sortInfo = sortings.find((sorting) => sorting.id === values.sortingId)?.sortInfo;
                    console.log(sortInfo);
                }}
            >
                <Typography variant="h5">FilterBar with SingleSelect</Typography>
                <FilterBar>
                    <Field name="sortingId">
                        {({ input: { value, onChange } }) => (
                            <FilterBarSingleSelect value={value} onChange={onChange} renderValue={() => <>Sorted by {sortedBy?.label}</>}>
                                {sortings.map((sorting) => {
                                    return (
                                        <MenuItem key={sorting.id} value={sorting.id}>
                                            {sorting.label}
                                        </MenuItem>
                                    );
                                })}
                            </FilterBarSingleSelect>
                        )}
                    </Field>
                </FilterBar>
            </TableFilterFinalForm>
            Filters: {JSON.stringify(filterApi.current)}
            <Table
                data={filteredData}
                totalCount={filteredData.length}
                columns={[
                    {
                        name: "model",
                        header: "Model",
                    },
                    {
                        name: "horsepower",
                        header: "Horsepower",
                    },
                    {
                        name: "price",
                        header: "Price",
                        render: ({ price }) => {
                            return `${price} €`;
                        },
                    },
                ]}
            />
        </>
    );
}

storiesOf("@comet/admin/table/filterbar", module).add("Filterbar Single Select", () => {
    const randomTableData = Array.from(Array(30).keys()).map((i): ExampleRow => {
        return {
            id: i,
            model: faker.vehicle.model(),
            horsepower: faker.datatype.number({ min: 50, max: 200 }),
            price: Number(faker.commerce.price(100, 1000, 2)),
        };
    });
    return <Story tableData={randomTableData} />;
});

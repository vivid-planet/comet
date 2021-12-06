import { Field, FilterBar, Table, TableFilterFinalForm, useTableQueryFilter } from "@comet/admin";
import { MenuItem, Select, Typography } from "@material-ui/core";
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
    sortedBy: string;
}

interface ExampleRow {
    id: number;
    model: string;
    brand: string;
    color: string;
    horsepower: number;
    price: number;
    owner: {
        firstname: string;
        lastname: string;
    };
}

interface StoryProps {
    tableData: ExampleRow[];
}

function Story({ tableData }: StoryProps) {
    const filterApi = useTableQueryFilter<Partial<FilterValues>>({
        sortedBy: sortings[0].id,
    });

    const sortedBy = sortings.find((sorting) => {
        return filterApi.current.sortedBy === sorting.id;
    });

    const filteredData = tableData.sort((item1, item2) => {
        const column = sortedBy?.sortInfo.columnName;
        const direction = sortedBy?.sortInfo.direction;

        if (column && direction) {
            if (direction === SortDirection.ASC) {
                return item1[column] - item2[column];
            } else {
                return item2[column] - item1[column];
            }
        }

        return 0;
    });

    return (
        <>
            <TableFilterFinalForm filterApi={filterApi}>
                <Typography variant="h5">FilterBar</Typography>
                <FilterBar>
                    <Field name="sortedBy">
                        {({ input: { value, onChange } }) => (
                            <Select
                                displayEmpty
                                renderValue={() => <>Sorted by {sortedBy?.label}</>}
                                MenuProps={{
                                    anchorOrigin: {
                                        vertical: "bottom",
                                        horizontal: "left",
                                    },
                                    transformOrigin: {
                                        vertical: "top",
                                        horizontal: "left",
                                    },
                                    getContentAnchorEl: null,
                                }}
                                value={value}
                                onChange={onChange}
                            >
                                {sortings.map((sorting) => {
                                    return (
                                        <MenuItem key={sorting.id} value={sorting.id}>
                                            {sorting.label}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
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
                        name: "brand",
                        header: "Brand",
                    },
                    {
                        name: "model",
                        header: "Model",
                    },
                    {
                        name: "color",
                        header: "Color",
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
                    {
                        name: "owner",
                        header: "Owner (Firstname Lastname)",
                        render: ({ owner }) => {
                            return `${owner.firstname} ${owner.lastname}`;
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
            brand: faker.vehicle.manufacturer(),
            color: faker.commerce.color(),
            horsepower: faker.datatype.number({ min: 50, max: 200 }),
            price: Number(faker.commerce.price(100, 1000, 2)),
            owner: {
                firstname: faker.name.firstName(),
                lastname: faker.name.lastName(),
            },
        };
    });
    return <Story tableData={randomTableData} />;
});

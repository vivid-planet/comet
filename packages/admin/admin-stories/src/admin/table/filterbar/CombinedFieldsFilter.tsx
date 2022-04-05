import {
    Field,
    FilterBar,
    FilterBarPopoverFilter,
    FinalFormRangeInput,
    FinalFormSwitch,
    Table,
    TableFilterFinalForm,
    useTableQueryFilter,
} from "@comet/admin";
import { Box, Divider, FormControlLabel, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import faker from "faker";
import * as React from "react";

interface IFilterValues {
    expressDelivery: boolean;
    price: {
        min: number;
        max: number;
    };
}

interface IExampleRow {
    id: number;
    price: string;
    expressDelivery: boolean;
}

interface StoryProps {
    tableData: IExampleRow[];
}

function Story({ tableData }: StoryProps) {
    const filterApi = useTableQueryFilter<Partial<IFilterValues>>({});

    const filteredData = tableData
        .filter(
            (item) =>
                filterApi.current.price === undefined ||
                (Number(item.price) > filterApi.current.price?.min && Number(item.price) < filterApi.current.price?.max),
        )
        .filter((item) => filterApi.current.expressDelivery === undefined || item.expressDelivery === filterApi.current.expressDelivery);

    return (
        <>
            <TableFilterFinalForm filterApi={filterApi}>
                <Typography variant="h5">FilterBar</Typography>
                <FilterBar>
                    <FilterBarPopoverFilter label={"Price"}>
                        <Box maxWidth={350}>
                            <Field name="price" component={FinalFormRangeInput} startAdornment={"€"} fullWidth min={50} max={1000} />
                            <Divider />
                            <Field name="expressDelivery" type="checkbox" fullWidth>
                                {(props) => <FormControlLabel label={"Express delivery"} control={<FinalFormSwitch {...props} />} />}
                            </Field>
                            <Box paddingBottom={4} paddingLeft={4} paddingRight={4}>
                                <Typography variant={"body2"}>
                                    Show all articles that can be shipped with express delivery (usually shipped within 2-3 work days)
                                </Typography>
                            </Box>
                        </Box>
                    </FilterBarPopoverFilter>
                </FilterBar>
            </TableFilterFinalForm>
            Filters: {JSON.stringify(filterApi.current)}
            <Table
                data={filteredData}
                totalCount={filteredData.length}
                columns={[
                    {
                        name: "price",
                        header: "Price",
                        render: ({ price }) => {
                            return `${price} €`;
                        },
                    },
                    {
                        name: "expressDelivery",
                        header: "Expressdelivery",
                        render: ({ expressDelivery }) => {
                            return expressDelivery ? "Yes" : "No";
                        },
                    },
                ]}
            />
        </>
    );
}

storiesOf("@comet/admin/table/filterbar", module).add("Filterbar with Combined Fields Filter (Price/Delivery)", () => {
    const randomTableData = Array.from(Array(30).keys()).map((i): IExampleRow => {
        return {
            id: i,
            price: faker.commerce.price(100, 1000, 2),
            expressDelivery: faker.datatype.boolean(),
        };
    });
    return <Story tableData={randomTableData} />;
});

import {
    Field,
    FilterBar,
    FilterBarMoreFilters,
    FilterBarPopoverFilter,
    FinalFormInput,
    FinalFormRangeInput,
    FinalFormSwitch,
    Table,
    TableFilterFinalForm,
    useTableQueryFilter,
} from "@comet/admin";
import { FinalFormReactSelectStaticOptions } from "@comet/admin-react-select";
import { Box, Divider, FormControlLabel, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import faker from "faker";
import * as React from "react";

interface ColorFilterFieldProps {
    colors: string[];
}

const ColorFilterField: React.FC<ColorFilterFieldProps> = ({ colors }) => {
    const options = colors
        .filter((color, index, colorsArray) => colorsArray.indexOf(color) == index) //filter colorsArray to only have unique values as select options
        .map((color) => {
            return { value: color, label: color };
        });

    return <Field name="color" type="text" component={FinalFormReactSelectStaticOptions} fullWidth options={options} />;
};

interface IFilterValues {
    brand: string;
    model: string;
    color: string;
    horsepower: {
        min: number;
        max: number;
    };
    price: {
        min: number;
        max: number;
    };
    owner: {
        firstname: string;
        lastname: string;
    };
}

interface IExampleRow {
    id: number;
    model: string;
    brand: string;
    color: string;
    horsepower: number;
    price: string;
    owner: {
        firstname: string;
        lastname: string;
    };
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
        price: {
            min: 50,
            max: 1000,
        },
    });

    const filteredData = tableData
        .filter((item) => filterApi.current.color === undefined || item.color === filterApi.current.color)
        .filter((item) => filterApi.current.model === undefined || item.model.includes(filterApi.current.model))
        .filter((item) => filterApi.current.brand === undefined || item.brand.includes(filterApi.current.brand))
        .filter(
            (item) =>
                filterApi.current.horsepower === undefined ||
                (item.horsepower > filterApi.current.horsepower?.min && item.horsepower < filterApi.current.horsepower?.max),
        )
        .filter(
            (item) =>
                filterApi.current.price === undefined ||
                (Number(item.price) > filterApi.current.price?.min && Number(item.price) < filterApi.current.price?.max),
        )
        .filter(
            (item) =>
                filterApi.current.owner === undefined ||
                filterApi.current.owner.firstname === undefined ||
                item.owner.firstname.includes(filterApi.current.owner.firstname),
        )
        .filter(
            (item) =>
                filterApi.current.owner === undefined ||
                filterApi.current.owner.lastname === undefined ||
                item.owner.lastname.includes(filterApi.current.owner.lastname),
        );

    return (
        <>
            <TableFilterFinalForm filterApi={filterApi}>
                <Typography variant="h5">FilterBar</Typography>
                <FilterBar>
                    <FilterBarPopoverFilter label={"Brand"}>
                        <Field name="brand" type="text" component={FinalFormInput} fullWidth />
                    </FilterBarPopoverFilter>
                    <FilterBarPopoverFilter label={"Model"}>
                        <Field name="model" type="text" component={FinalFormInput} fullWidth />
                    </FilterBarPopoverFilter>
                    <FilterBarPopoverFilter label={"Owner"}>
                        <Field label={"Firstname:"} name="owner.firstname" type="text" component={FinalFormInput} fullWidth />
                        <Field label={"Lastname:"} name="owner.lastname" type="text" component={FinalFormInput} fullWidth />
                    </FilterBarPopoverFilter>
                    <FilterBarMoreFilters>
                        <FilterBarPopoverFilter label={"Color"}>
                            <ColorFilterField colors={tableData.map((item) => item.color)} />
                        </FilterBarPopoverFilter>
                        <FilterBarPopoverFilter label={"Horsepower"}>
                            <Field name="horsepower" component={FinalFormRangeInput} fullWidth min={50} max={200} />
                        </FilterBarPopoverFilter>
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
                    </FilterBarMoreFilters>
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

storiesOf("@comet/admin/table/filterbar", module).add("Filterbar with all kinds of Filters", () => {
    const randomTableData = Array.from(Array(30).keys()).map((i): IExampleRow => {
        return {
            id: i,
            model: faker.vehicle.model(),
            brand: faker.vehicle.manufacturer(),
            color: faker.commerce.color(),
            horsepower: faker.datatype.number({ min: 50, max: 200 }),
            price: faker.commerce.price(100, 1000, 2),
            owner: {
                firstname: faker.name.firstName(),
                lastname: faker.name.lastName(),
            },
        };
    });
    return <Story tableData={randomTableData} />;
});

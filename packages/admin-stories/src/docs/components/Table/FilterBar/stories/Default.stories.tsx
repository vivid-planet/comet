import {
    Field,
    FilterBar,
    FilterBarMoreFilters,
    FilterBarPopoverFilter,
    FinalFormInput,
    FinalFormSelect,
    Table,
    TableFilterFinalForm,
    useTableQueryFilter,
} from "@comet/admin";
import { Typography } from "@material-ui/core";
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

    return (
        <Field
            name="color"
            type="text"
            component={FinalFormSelect}
            getOptionLabel={(option: { value: string; label: string }) => option.label}
            getOptionSelected={(option: { value: string; label: string }, value: { value: string; label: string }) => {
                return option.value === value.value;
            }}
            fullWidth
            options={options}
        />
    );
};

interface IFilterValues {
    brand: string;
    model: string;
    color: { value: string; label: string };
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

export const randomTableData = Array.from(Array(15).keys()).map((i): IExampleRow => {
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

storiesOf("stories/components/Table/FilterBar/FilterBar/Default", module).add("Default", () => {
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

    const filteredData = randomTableData
        .filter((item) => filterApi.current.color === undefined || item.color === filterApi.current.color.value)
        .filter((item) => filterApi.current.model === undefined || item.model.includes(filterApi.current.model))
        .filter((item) => filterApi.current.brand === undefined || item.brand.includes(filterApi.current.brand))
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
                            <ColorFilterField colors={randomTableData.map((item) => item.color)} />
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
});

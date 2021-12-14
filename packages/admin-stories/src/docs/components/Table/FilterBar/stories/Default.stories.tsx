import {
    Field,
    FilterBar,
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
    model: string;
    color: { value: string; label: string };
}

interface IExampleRow {
    id: number;
    model: string;
    brand: string;
    color: string;
}

export const randomTableData = Array.from(Array(5).keys()).map((i): IExampleRow => {
    return {
        id: i,
        model: faker.vehicle.model(),
        brand: faker.vehicle.manufacturer(),
        color: faker.commerce.color(),
    };
});

storiesOf("stories/components/Table/FilterBar/FilterBar/Default", module).add("Default", () => {
    const filterApi = useTableQueryFilter<Partial<IFilterValues>>({});
    const filteredData = randomTableData
        .filter((item) => filterApi.current.color === undefined || item.color === filterApi.current.color.value)
        .filter((item) => filterApi.current.model === undefined || item.model.includes(filterApi.current.model));
    return (
        <>
            <TableFilterFinalForm filterApi={filterApi}>
                <Typography variant="h5">FilterBar</Typography>
                <FilterBar>
                    <FilterBarPopoverFilter label={"Model"}>
                        <Field name="model" type="text" component={FinalFormInput} fullWidth />
                    </FilterBarPopoverFilter>
                    <FilterBarPopoverFilter label={"Color"}>
                        <ColorFilterField colors={randomTableData.map((item) => item.color)} />
                    </FilterBarPopoverFilter>
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
                ]}
            />
        </>
    );
});

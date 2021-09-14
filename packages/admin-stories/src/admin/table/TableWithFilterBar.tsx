import {
    Field,
    FilterBar,
    FilterBarMoreFilters,
    FilterBarPopoverFilter,
    FinalFormInput,
    FinalFormRangeInput,
    Table,
    TableFilterFinalForm,
    useTableQueryFilter,
} from "@comet/admin";
import { FinalFormReactSelectStaticOptions } from "@comet/admin-react-select";
import { Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import faker from "faker";
import * as React from "react";

interface ColorFilterFieldProps {
    colors: string[];
}

const ColorFilterField: React.FC<ColorFilterFieldProps> = ({ colors }) => {
    const options = colors
        .filter((color, index, colorsArray) => colorsArray.indexOf(color) == index)
        .map((color) => {
            return { value: color, label: color };
        });

    return <Field name="color" type="text" component={FinalFormReactSelectStaticOptions} fullWidth options={options} label={"Color:"} />;
};

interface IFilterValues {
    brand: string;
    model: string;
    color: string;
    horsepower: {
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
                        <Field label={"Brand:"} name="brand" type="text" component={FinalFormInput} fullWidth />
                    </FilterBarPopoverFilter>
                    <FilterBarPopoverFilter label={"Model"}>
                        <Field label={"Model:"} name="model" type="text" component={FinalFormInput} fullWidth />
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
                            <Field label={"Horsepower:"} name="horsepower" component={FinalFormRangeInput} fullWidth min={50} max={200} />
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
                        header: "Modell",
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

storiesOf("@comet/admin/table", module).add("Table with Filterbar", () => {
    const randomTableData = Array.from(Array(30).keys()).map((i): IExampleRow => {
        return {
            id: i,
            model: faker.vehicle.model(),
            brand: faker.vehicle.manufacturer(),
            color: faker.commerce.color(),
            horsepower: Math.floor(Math.random() * (200 - 50 + 1)) + 50, //min = 50, max = 200, amout: 30
            owner: {
                firstname: faker.name.firstName(),
                lastname: faker.name.lastName(),
            },
        };
    });
    return <Story tableData={randomTableData} />;
});

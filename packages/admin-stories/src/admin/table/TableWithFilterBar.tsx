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
import * as React from "react";

import { generateRandomColors, generateRandomIntNumbers, generateRandomString } from "../helpers/DataGenerators";

interface ExampleWithSelectProps {
    colors: string[];
}

const ExampleWithSelect: React.FC<ExampleWithSelectProps> = ({ colors }) => {
    const options = colors
        .filter((color, index, colorsArray) => colorsArray.indexOf(color) == index)
        .map((color) => {
            return { value: color, label: color };
        });

    return <Field name="color" type="text" component={FinalFormReactSelectStaticOptions} fullWidth options={options} label={"Farbe:"} />;
};

interface IFilterValues {
    brand: string;
    model: string;
    color: string;
    range: {
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
        range: {
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
                filterApi.current.range === undefined ||
                (item.horsepower > filterApi.current.range?.min && item.horsepower < filterApi.current.range?.max),
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
                    <FilterBarPopoverFilter label={"Marke"}>
                        <Field label={"Marke:"} name="brand" type="text" component={FinalFormInput} fullWidth />
                    </FilterBarPopoverFilter>
                    <FilterBarPopoverFilter label={"Modell"}>
                        <Field label={"Modell:"} name="model" type="text" component={FinalFormInput} fullWidth />
                    </FilterBarPopoverFilter>
                    <FilterBarPopoverFilter label={"Besitzer"}>
                        <Field label={"Vorname:"} name="owner.firstname" type="text" component={FinalFormInput} fullWidth />
                        <Field label={"Nachname:"} name="owner.lastname" type="text" component={FinalFormInput} fullWidth />
                    </FilterBarPopoverFilter>
                    <FilterBarMoreFilters>
                        <FilterBarPopoverFilter label={"Farbe"}>
                            <ExampleWithSelect colors={tableData.map((item) => item.color)} />
                        </FilterBarPopoverFilter>
                        <FilterBarPopoverFilter label={"Range"}>
                            <Field label={"PS:"} name="range" component={FinalFormRangeInput} fullWidth min={50} max={200} />
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
                        header: "Marke",
                    },
                    {
                        name: "model",
                        header: "Modell",
                    },
                    {
                        name: "color",
                        header: "Farbe",
                    },
                    {
                        name: "horsepower",
                        header: "PS",
                    },
                    {
                        name: "owner",
                        header: "Besitzer (Vorname Nachname)",
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
    const randomBrands = generateRandomString(30, 10);
    const randomFirstNames = generateRandomString(30, 7);
    const randomLastNames = generateRandomString(30, 12);
    const randomModels = generateRandomString(30, 15);
    const randomColors = generateRandomColors(30);
    const randomNumbers = generateRandomIntNumbers(30, 50, 200);

    const randomTableData = Array.from(Array(30).keys()).map((i): IExampleRow => {
        return {
            id: i,
            model: `${randomModels[i]}`,
            brand: `${randomBrands[i]}`,
            color: `${randomColors[i]}`,
            horsepower: randomNumbers[i],
            owner: {
                firstname: `${randomFirstNames[i]}`,
                lastname: `${randomLastNames[i]}`,
            },
        };
    });
    return <Story tableData={randomTableData} />;
});

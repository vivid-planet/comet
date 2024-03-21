import {
    Field,
    FilterBar,
    FilterBarMoreFilters,
    FilterBarPopoverFilter,
    FinalFormInput,
    FinalFormRangeInput,
    Stack,
    StackBackButton,
    StackLink,
    StackPage,
    StackSwitch,
    Table,
    TableFilterFinalForm,
    Toolbar,
    ToolbarItem,
    ToolbarTitleItem,
    usePersistedStateId,
    useTableQueryFilter,
} from "@comet/admin";
import { FinalFormReactSelectStaticOptions } from "@comet/admin-react-select";
import { Link, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import faker from "faker";
import * as React from "react";

import { storyRouterDecorator } from "../../../../story-router.decorator";

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

interface FilterValues {
    model: string;
    color: string;
    price: {
        min: number;
        max: number;
    };
    owner: {
        firstname: string;
        lastname: string;
    };
}

interface Car {
    id: number;
    model: string;
    color: string;
    price: string;
    owner: {
        firstname: string;
        lastname: string;
    };
}

const tableData = Array.from(Array(10).keys()).map((i): Car => {
    return {
        id: i,
        model: faker.vehicle.model(),
        color: faker.commerce.color(),
        price: faker.commerce.price(100, 1000, 2),
        owner: {
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
        },
    };
});

storiesOf("stories/components/Table/Table with Filterbar", module)
    .addDecorator(storyRouterDecorator())
    .add("Table with Filterbar", () => {
        // step 1
        const filterApi = useTableQueryFilter<Partial<FilterValues>>({
            price: {
                min: 50,
                max: 1000,
            },
        });

        // step 5
        // in a real application you would probably do the filtering in the API,
        // then you would pass the values of filterApi.current as variables to a graphql query
        const filteredData = tableData
            .filter((item) => filterApi.current.color === undefined || item.color === filterApi.current.color)
            .filter((item) => filterApi.current.model === undefined || item.model.includes(filterApi.current.model))
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
                {/*// step 2*/}
                <TableFilterFinalForm filterApi={filterApi}>
                    <Typography variant="h5">FilterBar</Typography>
                    {/*// step 3*/}
                    <FilterBar>
                        {/*// step 4*/}
                        <FilterBarPopoverFilter label="Model">
                            <Field name="model" type="text" component={FinalFormInput} fullWidth />
                        </FilterBarPopoverFilter>
                        <FilterBarPopoverFilter label="Owner">
                            <Field label="Firstname:" name="owner.firstname" type="text" component={FinalFormInput} fullWidth />
                            <Field label="Lastname:" name="owner.lastname" type="text" component={FinalFormInput} fullWidth />
                        </FilterBarPopoverFilter>
                        <FilterBarMoreFilters>
                            <FilterBarPopoverFilter label="Color">
                                <ColorFilterField colors={tableData.map((item) => item.color)} />
                            </FilterBarPopoverFilter>
                            <FilterBarPopoverFilter label="Price">
                                <Field name="price" component={FinalFormRangeInput} startAdornment="€" fullWidth min={50} max={1000} />
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
                            name: "model",
                            header: "Model",
                        },
                        {
                            name: "color",
                            header: "Color",
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
    })
    .add("Table with Filterbar and Persisted State", () => {
        const TablePage = ({ persistedStateId }: { persistedStateId: string }) => {
            const filterApi = useTableQueryFilter<Partial<{ query: string }>>(
                {
                    query: "",
                },
                { persistedStateId },
            );

            // in a real application you would probably do the filtering in the API,
            // then you would pass the values of filterApi.current as variables to a graphql query
            const filteredData = tableData.filter(
                (item) =>
                    item.owner.firstname.toLowerCase().includes(filterApi.current.query?.toLowerCase() ?? "") ||
                    item.owner.lastname.toLowerCase().includes(filterApi.current.query?.toLowerCase() ?? ""),
            );

            return (
                <div>
                    <TableFilterFinalForm filterApi={filterApi}>
                        <Typography variant="h5">FilterBar</Typography>
                        <FilterBar>
                            <label>
                                Search: <Field name="query" type="text" component={FinalFormInput} fullWidth />
                            </label>
                        </FilterBar>
                    </TableFilterFinalForm>
                    {JSON.stringify(filterApi.current)}
                    <Table
                        data={filteredData}
                        totalCount={filteredData.length}
                        columns={[
                            {
                                name: "owner",
                                header: "Name",
                                render: ({ owner }) => {
                                    return `${owner.firstname} ${owner.lastname}`;
                                },
                            },
                            {
                                name: "detail",
                                render: ({ id }) => {
                                    return (
                                        <Link component={StackLink} pageName="detail" payload={String(id)}>
                                            Show Details
                                        </Link>
                                    );
                                },
                            },
                        ]}
                    />
                </div>
            );
        };

        const DetailPage = ({ selectedId }: { selectedId: string }) => {
            const item = tableData.find((item) => item.id === Number(selectedId));

            return (
                <div>
                    <Toolbar>
                        <ToolbarItem>
                            <StackBackButton />
                        </ToolbarItem>
                        <ToolbarTitleItem>Detail Page</ToolbarTitleItem>
                    </Toolbar>
                    <h1>
                        {item?.owner.firstname} <strong>{item?.owner.lastname}</strong>
                    </h1>
                </div>
            );
        };

        const persistedStateId = usePersistedStateId();

        return (
            <Stack topLevelTitle="Stack">
                <StackSwitch>
                    <StackPage name="table">
                        <TablePage persistedStateId={persistedStateId} />
                    </StackPage>
                    <StackPage name="detail">{(selectedId) => <DetailPage selectedId={selectedId} />}</StackPage>
                </StackSwitch>
            </Stack>
        );
    });

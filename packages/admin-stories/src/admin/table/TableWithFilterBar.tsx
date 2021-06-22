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

interface IFilterValues {
    username: any;
    name: any;
    email: any;
    website: any;
    range: {
        min: number;
        max: number;
    };
}

const ExampleWithSelect: React.FC = () => {
    const options = [
        { value: "Sincere@april.biz", label: "Sincere@april.biz" },
        { value: "Shanna@melissa.tv", label: "Shanna@melissa.tv" },
        { value: "Nathan@yesenia.net", label: "Nathan@yesenia.net" },
    ];
    return <Field name="email" type="text" component={FinalFormReactSelectStaticOptions} fullWidth options={options} />;
};

interface IExampleRow {
    id: number;
    username: string;
    email: string;
    name: string;
}

function Story() {
    const data = Array.from(Array(30).keys()).map(
        (i): IExampleRow => ({
            id: i,
            username: `blub1 ${i}`,
            email: `blub1 ${i}`,
            name: `blub2 ${i}`,
        }),
    );

    const filterApi = useTableQueryFilter<Partial<IFilterValues>>({
        range: {
            min: 0,
            max: 100,
        },
    });

    return (
        <>
            <TableFilterFinalForm filterApi={filterApi}>
                <Typography variant="h5">FilterBar</Typography>
                <FilterBar>
                    <FilterBarPopoverFilter label={"Username"}>
                        <Field name="username" type="text" component={FinalFormInput} fullWidth />
                    </FilterBarPopoverFilter>
                    <FilterBarMoreFilters>
                        <FilterBarPopoverFilter label={"Email"}>
                            <ExampleWithSelect />
                        </FilterBarPopoverFilter>
                        <FilterBarPopoverFilter label={"Name"}>
                            <Field name="name" type="text" component={FinalFormInput} fullWidth />
                        </FilterBarPopoverFilter>
                        <FilterBarPopoverFilter label={"Range"}>
                            <Field name="range" component={FinalFormRangeInput} fullWidth min={0} max={100} />
                        </FilterBarPopoverFilter>
                        <FilterBarPopoverFilter label={"Website"}>
                            <Field name="website.url" type="text" component={FinalFormInput} fullWidth />
                            <Field name="website.name" type="text" component={FinalFormInput} fullWidth />
                            <Field name="maxi" type="text" component={FinalFormInput} fullWidth />
                        </FilterBarPopoverFilter>
                    </FilterBarMoreFilters>
                </FilterBar>
            </TableFilterFinalForm>
            Filters: {JSON.stringify(filterApi.current)}
            <Table
                data={data}
                totalCount={data.length}
                columns={[
                    {
                        name: "name",
                        header: "Name",
                    },
                    {
                        name: "username",
                        header: "Username",
                    },
                    {
                        name: "email",
                        header: "E-Mail",
                    },
                ]}
            />
        </>
    );
}

storiesOf("@comet/admin/table", module).add("Table with Filterbar", () => <Story />);

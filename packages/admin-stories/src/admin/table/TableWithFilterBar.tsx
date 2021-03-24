import {
    Field,
    FilterBar,
    FinalFormInput,
    IFilterBarField,
    Table,
    TableFilterFinalForm,
    TableQuery,
    useTableQuery,
    useTableQueryFilter,
} from "@comet/admin";
import { FinalFormReactSelectStaticOptions } from "@comet/admin-react-select";
import { storiesOf } from "@storybook/react";
import gql from "graphql-tag";
import * as qs from "qs";
import * as React from "react";

import { apolloStoryDecorator } from "../../apollo-story.decorator";

const gqlRest = gql;

const query = gqlRest`
query users(
    $pathFunction: any
    $query: String
    $name: String
    $username: String
) {
    users(
        query: $name
    ) @rest(type: "User", pathBuilder: $pathFunction) {
        id
        name
        username
        email
    }
}
`;
function pathFunction({ args }: { args: { [key: string]: any } }) {
    interface IPathMapping {
        [arg: string]: string;
    }
    const paramMapping: IPathMapping = {
        query: "q",
    };

    const q = Object.keys(args).reduce((acc: { [key: string]: any }, key: string): { [key: string]: any } => {
        if (paramMapping[key] && args[key]) {
            acc[paramMapping[key]] = args[key];
        }
        return acc;
    }, {});
    return `users?${qs.stringify(q, { arrayFormat: "brackets" })}`;
}

interface IQueryData {
    users: Array<{
        id: number;
        name: string;
        username: string;
        email: string;
    }>;
}

interface IFilterValues {
    name: string;
    nameBlub: string;
}

interface IVariables extends IFilterValues {
    pathFunction: any;
}

const Name: React.FC = () => {
    return <Field name="name" type="text" component={FinalFormInput} fullWidth />;
};

const NameBlub: React.FC = () => {
    const options = [
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry", isDisabled: true },
        { value: "vanilla", label: "Vanilla" },
    ];
    return <Field name="nameBlub" type="text" component={FinalFormReactSelectStaticOptions} fullWidth options={options} />;
};

const fields: IFilterBarField[] = [
    { name: "nameBlub", label: "nameBlub", component: NameBlub, placeHolder: "Bitte wählen", labelValueFunction: (value: string) => value },
    {
        name: "name",
        label: "name",
        component: Name,
        placeHolder: "Suche...",
        labelValueFunction: (value: string) => value,
    },
];

function Story() {
    const filterApi = useTableQueryFilter<Partial<IFilterValues>>({});
    const { tableData, api, loading, error } = useTableQuery<IQueryData, Partial<IVariables>>()(query, {
        variables: {
            ...filterApi.current,
            pathFunction,
        },
        resolveTableData: (data) => ({
            data: data.users,
            totalCount: data.users.length,
        }),
    });

    return (
        <TableQuery api={api} loading={loading} error={error}>
            <TableFilterFinalForm filterApi={filterApi}>
                <FilterBar fieldBarWidth={200} fieldSidebarHeight={550} fields={fields} />
            </TableFilterFinalForm>
            {tableData && (
                <Table
                    {...tableData}
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
            )}
        </TableQuery>
    );
}

storiesOf("@comet/admin/table", module)
    .addDecorator(apolloStoryDecorator())
    .add("Table with Filterbar", () => <Story />);

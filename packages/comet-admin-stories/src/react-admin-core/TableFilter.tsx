import { storiesOf } from "@storybook/react";
import {
    Field,
    FieldContainerLabelAbove,
    FinalFormInput,
    Table,
    TableFilterFinalForm,
    TableQuery,
    useTableQuery,
    useTableQueryFilter,
} from "@vivid-planet/comet-admin";
import gql from "graphql-tag";
import * as qs from "qs";
import * as React from "react";

import { apolloStoryDecorator } from "../apollo-story.decorator";

const gqlRest = gql;

const query = gqlRest`
query users(
    $pathFunction: any
    $query: String
) {
    users(
        query: $query
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
    query?: string;
}
interface IVariables extends IFilterValues {
    pathFunction: any;
}

function Story() {
    const filterApi = useTableQueryFilter<IFilterValues>({});
    const { tableData, api, loading, error } = useTableQuery<IQueryData, IVariables>()(query, {
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
            {tableData && (
                <>
                    <TableFilterFinalForm filterApi={filterApi}>
                        <Field
                            name="query"
                            type="text"
                            label="Query"
                            component={FinalFormInput}
                            fullWidth
                            fieldContainerComponent={FieldContainerLabelAbove}
                        />
                    </TableFilterFinalForm>
                    <Table
                        {...tableData}
                        columns={[
                            {
                                name: "name",
                                header: "Name",
                                sortable: true,
                            },
                            {
                                name: "username",
                                header: "Username",
                                sortable: true,
                            },
                            {
                                name: "email",
                                header: "E-Mail",
                                sortable: true,
                            },
                        ]}
                    />
                </>
            )}
        </TableQuery>
    );
}

storiesOf("comet-admin", module)
    .addDecorator(apolloStoryDecorator())
    .add("Table Filter", () => <Story />);

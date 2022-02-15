import { gql } from "@apollo/client";
import { Field, Table, TableFilterFinalForm, TableQuery, useTableQuery, useTableQueryFilter } from "@comet/admin";
import { FinalFormReactSelectStaticOptions } from "@comet/admin-react-select";
import { Grid } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as qs from "qs";
import * as React from "react";

import { apolloStoryDecorator } from "../../apollo-story.decorator";

const gqlRest = gql;

const query = gqlRest`
query users(
    $pathFunction: any
    $selectQuery: String
) {
    users(
        selectQuery: $selectQuery
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
        selectQuery: "q",
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
    selectQuery?: string;
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
                    <TableFilterFinalForm filterApi={filterApi} resetButton>
                        <Grid container>
                            <Grid item xs={2}>
                                <Field
                                    name="selectQuery"
                                    label="Name"
                                    component={FinalFormReactSelectStaticOptions}
                                    options={[
                                        { label: "Leanne Graham", value: "Leanne Graham" },
                                        { label: "Ervin Howell", value: "Ervin Howell" },
                                        { label: "Clementine Bauch", value: "Clementine Bauch" },
                                    ]}
                                    isClearable
                                />
                            </Grid>
                        </Grid>
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

storiesOf("@comet/admin/table", module)
    .addDecorator(apolloStoryDecorator())
    .add("Reset Filter", () => <Story />);

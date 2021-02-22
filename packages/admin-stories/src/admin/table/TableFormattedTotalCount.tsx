import { createRestPagingActions, Table, TableQuery, useTableQuery, useTableQueryPaging } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import gql from "graphql-tag";
import * as numeral from "numeral";
import * as qs from "qs";
import * as React from "react";

import { apolloStoryDecorator } from "../../apollo-story.decorator";

const gqlRest = gql;

const query = gqlRest`
query users(
    $pathFunction: any
    $page: Int
) {
    users(
        page: $page
    ) @rest(type: "UsersPayload", pathBuilder: $pathFunction) {
        meta @type(name: "UsersMeta") {
            totalCount
            links
        }
        data @type(name: "User") {
            id
            name
            username
            email
        }
    }
}
`;

interface IQueryData {
    users: {
        meta: {
            totalCount: number;
            links: IResponseLinks;
        };
        data: Array<{
            id: number;
            name: string;
            username: string;
            email: string;
        }>;
    };
}

function pathFunction({ args }: { args: { [key: string]: any } }) {
    interface IPathMapping {
        [arg: string]: string;
    }
    const paramMapping: IPathMapping = {
        page: "_page",
    };

    const q = Object.keys(args).reduce((acc: { [key: string]: any }, key: string): { [key: string]: any } => {
        if (paramMapping[key] && args[key]) {
            acc[paramMapping[key]] = args[key];
        }
        return acc;
    }, {});
    return `users?${qs.stringify(q, { arrayFormat: "brackets" })}`;
}

interface IVariables {
    pathFunction: any;
    page: number;
}
function Story() {
    const pagingApi = useTableQueryPaging(1);
    const { tableData, api, loading, error } = useTableQuery<IQueryData, IVariables>()(query, {
        variables: {
            pathFunction,
            page: pagingApi.current,
        },
        resolveTableData: (data) => ({
            data: data.users.data,
            totalCount: data.users.meta.totalCount,
            pagingInfo: createRestPagingActions(
                pagingApi,
                {
                    nextPage: data.users.meta.links.next,
                    previousPage: data.users.meta.links.prev,
                    totalPages: data.users.meta.totalCount / 5,
                },
                {
                    pageParameterName: "_page",
                },
            ),
        }),
    });

    return (
        <TableQuery api={api} loading={loading} error={error}>
            {tableData && (
                <Table
                    rowName="Users"
                    renderTotalCount={getFormattedNumber}
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
            )}
        </TableQuery>
    );
}

function getFormattedNumber(totalCount: number) {
    return numeral(totalCount).format("0,0.00");
}

interface IResponseLinks {
    first?: string;
    prev?: string;
    next?: string;
    last?: string;
}
storiesOf("@comet/admin/table", module)
    .addDecorator(
        apolloStoryDecorator({
            responseTransformer: async (response) => {
                const links: IResponseLinks = {};
                const linkMatches = response.headers.get("link").match(/<(.*?)>; rel="(.*?)"/g) || [];
                linkMatches.forEach((i: string) => {
                    const m = i.match(/<(.*?)>; rel="(.*?)"/);
                    if (m) {
                        links[m[2] as keyof IResponseLinks] = m[1];
                    }
                });
                return {
                    data: await response.json(),
                    meta: {
                        links,
                        totalCount: response.headers.get("x-total-count"),
                    },
                };
            },
        }),
    )
    .add("Formatted Total Count", () => <Story />);

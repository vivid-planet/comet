import { gql } from "@apollo/client";
import type { Decorator } from "@storybook/react-vite";

import { ErrorDialogHandler } from "../../error/errordialog/ErrorDialogHandler";
import { Table } from "../Table";
import { TableQuery } from "../TableQuery";
import { useTableQuery } from "../useTableQuery";

interface People {
    id: string;
    name: string;
    birthYear: string;
    gender: string;
    homeworld: {
        name: string;
    };
}
interface QueryData {
    allPeople: {
        people: People[];
    };
}

const errorDialogDecorator: Decorator = (Story) => (
    <>
        <ErrorDialogHandler />
        <Story />
    </>
);

export default {
    title: "admin/table",
    decorators: [errorDialogDecorator],
    args: {
        query: "query StarWarsPeople {allPeople { people { id name birthYear gender homeworld{ name } } }}",
    },
    argTypes: {
        query: {
            name: "GQL Query",
        },
    },
};

type Args = {
    query: string;
};

export const GlobalErrorHandling = {
    render: ({ query }: Args) => {
        const { tableData, api, loading, error } = useTableQuery<QueryData, Record<string, any>>()(
            gql`
                ${query}
            `,
            {
                resolveTableData: (data) => ({
                    data: data.allPeople.people,
                    totalCount: data.allPeople.people.length,
                }),
                globalErrorHandling: true,
            },
        );

        return (
            <TableQuery api={api} loading={loading} error={error}>
                {tableData && (
                    <Table
                        {...tableData}
                        columns={[
                            {
                                name: "id",
                                header: "Id",
                            },
                            {
                                name: "name",
                                header: "Name",
                            },
                            {
                                name: "birthYear",
                                header: "Birthyear",
                            },
                            {
                                name: "gender",
                                header: "Gender",
                            },
                            {
                                name: "homeworld.name",
                                header: "Homeworld",
                            },
                        ]}
                    />
                )}
            </TableQuery>
        );
    },
};

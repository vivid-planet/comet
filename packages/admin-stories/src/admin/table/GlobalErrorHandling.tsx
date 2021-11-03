import { Table, TableQuery, useTableQuery } from "@comet/admin";
import { text } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import gql from "graphql-tag";
import * as React from "react";

import { apolloSwapiStoryDecorator } from "../../apollo-swapi-story.decorator";
import { errorDialogStoryProviderDecorator } from "../../docs/components/ErrorHandling/ErrorDialog/error-dialog-provider.decorator";

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

const Story: React.FunctionComponent = () => {
    const query = gql`
        ${text("GQL Query", "query StarWarsPeople {allPeople { people { id name birthYear gender homeworld{ name } } }}")}
    `;

    const { tableData, api, loading, error } = useTableQuery<QueryData, {}>()(query, {
        resolveTableData: (data) => ({
            data: data.allPeople.people,
            totalCount: data.allPeople.people.length,
        }),
        globalErrorHandling: true,
    });

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
};

storiesOf("@comet/admin/table/globalErrorHandling", module)
    .addDecorator(apolloSwapiStoryDecorator())
    .addDecorator(errorDialogStoryProviderDecorator())
    .add("Global Error Handling", () => <Story />);

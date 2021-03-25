import { LocalErrorScopeApolloContext, Table, TableQuery, useTableQuery } from "@comet/admin";
import { Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { boolean, text } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import gql from "graphql-tag";
import * as React from "react";

import { apolloSwapiStoryDecorator } from "../../apollo-swapi-story.decorator";
import { errorDialogStoryProviderDecorator } from "../../error-dialog-provider.decorator";

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

    const globalErrorScope = boolean("Use Error Dialog", true);

    const { tableData, api, loading, error } = useTableQuery<QueryData, {}>()(query, {
        resolveTableData: (data) => ({
            data: data.allPeople.people,
            totalCount: data.allPeople.people.length,
        }),
        context: globalErrorScope ? undefined : LocalErrorScopeApolloContext,
    });

    return (
        <div>
            <Alert severity={"info"}>
                <Typography paragraph={true}>Error Dialog Provider automatically shows an Error Dialog if an GQL Error happens. </Typography>
                <Typography paragraph={true}>
                    Go to knobs and try to make an invalid gql query. As soon you get an GQL Error the error dialog should appear.
                </Typography>
            </Alert>
            <TableQuery api={api} loading={loading} error={globalErrorScope ? undefined : error}>
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
        </div>
    );
};

storiesOf("@comet/admin/error-handling/error-dialog", module)
    .addDecorator(apolloSwapiStoryDecorator())
    .addDecorator(errorDialogStoryProviderDecorator())
    .add("ErrorDialogGraphql", () => <Story />);

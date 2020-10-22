import { ApolloProvider, useQuery } from "@apollo/react-hooks";
import { CircularProgress, Grid, IconButton } from "@material-ui/core";
import { Edit as EditIcon } from "@material-ui/icons";
import { storiesOf } from "@storybook/react";
import {
    FinalForm,
    IFilterApi,
    Stack,
    StackPage,
    StackSwitchApiContext,
    Table,
    TableFilterFinalForm,
    TableQuery,
    useStackSwitch,
    useTableQuery,
    useTableQueryFilter,
} from "@vivid-planet/react-admin-core";
import { Field, FieldContainerLabelAbove, Input } from "@vivid-planet/react-admin-form";
import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { ApolloLink } from "apollo-link";
import { RestLink } from "apollo-link-rest";
import gql from "graphql-tag";
import * as React from "react";
import StoryRouter from "storybook-react-router";

const gqlRest = gql;

const query = gqlRest`
query users(
    $query: String
) {
    users(
        query: $query
    ) @rest(type: "User", path: "users?q={args.query}") {
        id
        name
        username
        email
    }
}
`;

interface IQueryData {
    users: Array<{
        id: number;
        name: string;
        username: string;
        email: string;
    }>;
}

interface IFilterValues {
    query: string;
}
interface IVariables extends IFilterValues {}

interface IExampleTableProps {
    tableData: {
        data: IQueryData["users"];
        totalCount: number;
    };
    filterApi: IFilterApi<IFilterValues>;
}
function ExampleTable(props: IExampleTableProps) {
    const stackApi = React.useContext(StackSwitchApiContext);

    return (
        <>
            <TableFilterFinalForm filterApi={props.filterApi}>
                <Field name="query" type="text" label="Query" component={Input} fullWidth fieldContainerComponent={FieldContainerLabelAbove} />
            </TableFilterFinalForm>
            <Table
                {...props.tableData}
                columns={[
                    {
                        name: "name",
                        header: "Name",
                    },
                    {
                        name: "edit",
                        header: "",
                        cellProps: { padding: "none" },

                        render: row => (
                            <Grid item>
                                <IconButton
                                    onClick={() => {
                                        stackApi.activatePage("form", String(row.id));
                                    }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Grid>
                        ),
                    },
                ]}
            />
        </>
    );
}

interface IExampleFormProps {
    id: number;
}
function ExampleForm(props: IExampleFormProps) {
    const detailQuery = gqlRest`
    query user(
        $id: Int
    ) {
        user(
            id: $id
        ) @rest(type: "User", path: "users/{args.id}") {
            id
            name
        }
    }
    `;

    const { loading, data, error } = useQuery(detailQuery, { variables: { id: props.id } });

    if (loading || !data) {
        return <CircularProgress />;
    }
    if (error) return <p>Error :( {error.toString()}</p>;

    return (
        <FinalForm
            mode="edit"
            onSubmit={values => {
                // submit here
            }}
            initialValues={data.user}
        >
            <Field label="Name" name="name" defaultOptions required component={Input} />
        </FinalForm>
    );
}

function Story() {
    const filterApi = useTableQueryFilter<IFilterValues>({ query: "" });

    const { tableData, api, loading, error } = useTableQuery<IQueryData, IVariables>()(query, {
        variables: {
            ...filterApi.current,
        },
        resolveTableData: data => ({
            data: data.users,
            totalCount: data.users.length,
        }),
    });

    const { StackSwitch } = useStackSwitch();

    return (
        <Stack topLevelTitle="Stack">
            <TableQuery api={api} loading={loading} error={error}>
                <StackSwitch>
                    <StackPage name="table">{tableData && <ExampleTable tableData={tableData} filterApi={filterApi} />}</StackPage>
                    <StackPage name="form" title="bearbeiten">
                        {selectedId => <ExampleForm id={+selectedId} />}
                    </StackPage>
                </StackSwitch>
            </TableQuery>
        </Stack>
    );
}

storiesOf("react-admin-core", module)
    .addDecorator(story => {
        const link = ApolloLink.from([
            new RestLink({
                uri: "https://jsonplaceholder.typicode.com/",
            }),
        ]);

        const cache = new InMemoryCache();

        const client = new ApolloClient({
            link,
            cache,
        });

        return <ApolloProvider client={client}>{story()}</ApolloProvider>;
    })
    .addDecorator(StoryRouter())
    .add("Stack Table Form Query at stack", () => <Story />);

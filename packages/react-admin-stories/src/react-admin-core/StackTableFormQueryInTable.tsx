import { CircularProgress, Grid, IconButton, Typography } from "@material-ui/core";
import { Edit as EditIcon } from "@material-ui/icons";
import { storiesOf } from "@storybook/react";
import {
    FinalForm,
    Stack,
    StackPage,
    StackSwitch,
    StackSwitchApiContext,
    Table,
    TableFilterFinalForm,
    TableQuery,
    usePersistedStateId,
    useTableQuery,
    useTableQueryFilter,
} from "@vivid-planet/react-admin-core";
import { Field, FieldContainerLabelAbove, Input } from "@vivid-planet/react-admin-form";
import gql from "graphql-tag";
import * as React from "react";
import StoryRouter from "storybook-react-router";
import { apolloStoryDecorator } from "../apollo-story.decorator";

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

function ExampleTable(props: { persistedStateId: string }) {
    const filterApi = useTableQueryFilter<IFilterValues>({ query: "" }, { persistedStateId: props.persistedStateId });

    const { tableData, api, loading, error } = useTableQuery<IQueryData, IVariables>()(query, {
        variables: {
            ...filterApi.current,
        },
        resolveTableData: data => ({
            data: data.users,
            totalCount: data.users.length,
        }),
    });

    const stackApi = React.useContext(StackSwitchApiContext);

    return (
        <TableQuery api={api} loading={loading} error={error}>
            {tableData && (
                <>
                    <TableFilterFinalForm filterApi={filterApi}>
                        <Field
                            name="query"
                            type="text"
                            label="Query"
                            component={Input}
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
            )}
        </TableQuery>
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
    const persistedStateId = usePersistedStateId();
    return (
        <Stack topLevelTitle="Stack">
            <StackSwitch>
                <StackPage name="table">
                    <ExampleTable persistedStateId={persistedStateId} />
                </StackPage>
                <StackPage name="form" title="bearbeiten">
                    {selectedId => <ExampleForm id={+selectedId} />}
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}

storiesOf("react-admin-core", module)
    .addDecorator(apolloStoryDecorator())
    .addDecorator(StoryRouter())
    .add("Stack Table Form Query in Table", () => <Story />);

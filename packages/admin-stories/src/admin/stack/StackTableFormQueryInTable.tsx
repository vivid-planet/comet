import { gql, useQuery } from "@apollo/client";
import {
    Field,
    FinalForm,
    FinalFormInput,
    MainContent,
    Stack,
    StackPage,
    StackSwitch,
    StackSwitchApiContext,
    Table,
    TableFilterFinalForm,
    TableQuery,
    Toolbar,
    ToolbarBackButton,
    ToolbarItem,
    usePersistedStateId,
    useTableQuery,
    useTableQueryFilter,
} from "@comet/admin";
import { CircularProgress, Grid, IconButton, Typography } from "@material-ui/core";
import { Edit as EditIcon } from "@material-ui/icons";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import StoryRouter from "storybook-react-router";

import { apolloStoryDecorator } from "../../apollo-story.decorator";

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
        resolveTableData: (data) => ({
            data: data.users,
            totalCount: data.users.length,
        }),
    });

    const stackApi = React.useContext(StackSwitchApiContext);

    return (
        <TableQuery api={api} loading={loading} error={error}>
            <Toolbar>
                <ToolbarItem>
                    <Typography variant={"h3"}>Stack Table Form Query In Table</Typography>
                </ToolbarItem>
                <ToolbarItem>
                    <TableFilterFinalForm filterApi={filterApi}>
                        <Field name="query" type="text" component={FinalFormInput} fullWidth />
                    </TableFilterFinalForm>
                </ToolbarItem>
            </Toolbar>
            {tableData && (
                <MainContent>
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

                                render: (row) => (
                                    <Grid item>
                                        <IconButton
                                            onClick={() => {
                                                stackApi.activatePage("form", String(row.id));
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Grid>
                                ),
                            },
                        ]}
                    />
                </MainContent>
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
        <>
            <Toolbar>
                <ToolbarBackButton />
                <ToolbarItem>
                    <Typography variant={"h3"}>Stack Table Form Query In Table - Detail</Typography>
                </ToolbarItem>
            </Toolbar>
            <MainContent>
                <FinalForm
                    mode="edit"
                    onSubmit={(values) => {
                        // submit here
                    }}
                    initialValues={data.user}
                >
                    <Field label="Name" name="name" defaultOptions required component={FinalFormInput} />
                </FinalForm>
            </MainContent>
        </>
    );
}

function Story() {
    const persistedStateId = usePersistedStateId();
    return (
        <Stack topLevelTitle="Stack" showBackButton={false}>
            <StackSwitch>
                <StackPage name="table">
                    <ExampleTable persistedStateId={persistedStateId} />
                </StackPage>
                <StackPage name="form" title="bearbeiten">
                    {(selectedId) => <ExampleForm id={+selectedId} />}
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}

storiesOf("@comet/admin/stack", module)
    .addDecorator(apolloStoryDecorator())
    .addDecorator(StoryRouter())
    .add("Stack Table Form Query in Table", () => <Story />);

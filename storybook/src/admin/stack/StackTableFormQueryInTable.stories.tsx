import { gql, useQuery } from "@apollo/client";
import {
    Field,
    FinalForm,
    FinalFormInput,
    Loading,
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
import { Edit } from "@comet/admin-icons";
import { Card, CardContent, Grid, IconButton, Typography } from "@mui/material";
import { useContext } from "react";

import { apolloRestStoryDecorator } from "../../apollo-rest-story.decorator";
import { storyRouterDecorator } from "../../story-router.decorator";

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
type IVariables = IFilterValues;

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

    const stackApi = useContext(StackSwitchApiContext);

    return (
        <TableQuery api={api} loading={loading} error={error}>
            <Toolbar>
                <ToolbarItem>
                    <Typography variant="h3">Stack Table Form Query In Table</Typography>
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
                                    <Grid>
                                        <IconButton
                                            onClick={() => {
                                                stackApi.activatePage("form", String(row.id));
                                            }}
                                            size="large"
                                        >
                                            <Edit />
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

    if (error) return <p>Error :( {error.toString()}</p>;

    return (
        <>
            <Toolbar>
                <ToolbarBackButton />
                <ToolbarItem>
                    <Typography variant="h3">Stack Table Form Query In Table - Detail</Typography>
                </ToolbarItem>
            </Toolbar>
            <MainContent fullHeight>
                {loading || !data ? (
                    <Loading behavior="fillParent" />
                ) : (
                    <Card variant="outlined">
                        <CardContent>
                            <FinalForm
                                mode="edit"
                                onSubmit={(values) => {
                                    // submit here
                                }}
                                initialValues={data.user}
                            >
                                <Field label="Name" name="name" defaultOptions required component={FinalFormInput} />
                            </FinalForm>
                        </CardContent>
                    </Card>
                )}
            </MainContent>
        </>
    );
}

export default {
    title: "@comet/admin/stack",
    decorators: [apolloRestStoryDecorator(), storyRouterDecorator()],
};

export const StackTableFormQueryInTable = {
    render: () => {
        const persistedStateId = usePersistedStateId();
        return (
            <Stack topLevelTitle="Stack">
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
    },

    name: "Stack Table Form Query in Table",
};

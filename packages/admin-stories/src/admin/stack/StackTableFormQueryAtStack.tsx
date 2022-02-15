import { gql, useQuery } from "@apollo/client";
import {
    Field,
    FinalForm,
    FinalFormInput,
    IFilterApi,
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
    useTableQuery,
    useTableQueryFilter,
} from "@comet/admin";
import { Edit as EditIcon } from "@mui/icons-material";
import { CircularProgress, Grid, IconButton, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { apolloStoryDecorator } from "../../apollo-story.decorator";
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
            <Toolbar>
                <ToolbarBackButton />
                <ToolbarItem>
                    <Typography variant={"h3"}>Stack Table Form Query At Stack</Typography>
                </ToolbarItem>
                <ToolbarItem>
                    <TableFilterFinalForm filterApi={props.filterApi}>
                        <Field name="query" type="text" component={FinalFormInput} fullWidth />
                    </TableFilterFinalForm>
                </ToolbarItem>
            </Toolbar>

            <MainContent>
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

                            render: (row) => (
                                <Grid item>
                                    <IconButton
                                        onClick={() => {
                                            stackApi.activatePage("form", String(row.id));
                                        }}
                                        size="large"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Grid>
                            ),
                        },
                    ]}
                />
            </MainContent>
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
        <>
            <Toolbar>
                <ToolbarBackButton />
                <ToolbarItem>
                    <Typography variant={"h3"}>Stack Table Form Query At Stack - Detail</Typography>
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
    const filterApi = useTableQueryFilter<IFilterValues>({ query: "" });

    const { tableData, api, loading, error } = useTableQuery<IQueryData, IVariables>()(query, {
        variables: {
            ...filterApi.current,
        },
        resolveTableData: (data) => ({
            data: data.users,
            totalCount: data.users.length,
        }),
    });

    return (
        <Stack topLevelTitle="Stack">
            <TableQuery api={api} loading={loading} error={error}>
                <StackSwitch>
                    <StackPage name="table">{tableData && <ExampleTable tableData={tableData} filterApi={filterApi} />}</StackPage>
                    <StackPage name="form" title="bearbeiten">
                        {(selectedId) => <ExampleForm id={+selectedId} />}
                    </StackPage>
                </StackSwitch>
            </TableQuery>
        </Stack>
    );
}

storiesOf("@comet/admin/stack", module)
    .addDecorator(apolloStoryDecorator())
    .addDecorator(storyRouterDecorator())
    .add("Stack Table Form Query at stack", () => <Story />);

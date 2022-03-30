import { gql } from "@apollo/client";
import {
    DirtyHandler,
    Field,
    FinalForm,
    FinalFormInput,
    ISelectionApi,
    Selected,
    SelectionRoute,
    Table,
    TableQuery,
    useTableQuery,
} from "@comet/admin";
import { Grid } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Redirect, Route, Switch } from "react-router";

import { apolloStoryDecorator } from "../../apollo-story.decorator";
import { storyRouterDecorator } from "../../story-router.decorator";

const gqlRest = gql;

const query = gqlRest`
query users {
    users @rest(type: "User", path: "users") {
        id
        name
        username
        email
    }
}
`;

interface IUser {
    id: number;
    name: string;
    username: string;
    email: string;
}
interface IQueryData {
    users: IUser[];
}

interface IExampleTableProps {
    tableData: {
        data: IQueryData["users"];
        totalCount: number;
    };
    selectionApi: ISelectionApi;
    selectedId?: string;
}
function ExampleTable(props: IExampleTableProps) {
    return (
        <>
            <Table
                {...props.tableData}
                selectionApi={props.selectionApi}
                selectedId={props.selectedId}
                selectable={true}
                columns={[
                    {
                        name: "name",
                        header: "Name",
                    },
                ]}
            />
        </>
    );
}

interface IExampleFormProps {
    user: IUser;
    mode: "add" | "edit";
}
function ExampleForm(props: IExampleFormProps) {
    return (
        <FinalForm
            mode="edit"
            onSubmit={(values) => {
                // submit here
            }}
            initialValues={props.user}
        >
            <Field label="Name" name="name" defaultOptions required component={FinalFormInput} />
        </FinalForm>
    );
}

function Story() {
    const { tableData, api, loading, error } = useTableQuery<IQueryData, {}>()(query, {
        resolveTableData: (data) => ({
            data: data.users,
            totalCount: data.users.length,
        }),
    });

    if (!tableData) return null;

    return (
        <DirtyHandler>
            <SelectionRoute>
                {({ selectedId, selectionMode, selectionApi }) => (
                    <TableQuery api={api} loading={loading} error={error}>
                        <Grid container spacing={4}>
                            <Grid item xs={2}>
                                <ExampleTable tableData={tableData} selectedId={selectedId} selectionApi={selectionApi} />
                            </Grid>
                            <Grid item xs={2}>
                                <Selected selectionMode={selectionMode} selectedId={selectedId} rows={tableData.data}>
                                    {(user, { selectionMode: selectedSelectionMode }) => <ExampleForm mode={selectedSelectionMode} user={user} />}
                                </Selected>
                            </Grid>
                        </Grid>
                    </TableQuery>
                )}
            </SelectionRoute>
        </DirtyHandler>
    );
}

function App() {
    return (
        <Switch>
            <Route exact path="/">
                <Redirect to="/foo" />
            </Route>
            <Route path="/foo">
                <Story />
            </Route>
        </Switch>
    );
}

storiesOf("@comet/admin/table", module)
    .addDecorator(apolloStoryDecorator())
    .addDecorator(storyRouterDecorator())
    .add("Besides Form", () => <App />);

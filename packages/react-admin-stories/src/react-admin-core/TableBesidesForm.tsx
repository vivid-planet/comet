import { storiesOf } from "@storybook/react";
import { DirtyHandler, FinalForm, ISelectionApi, Selected, SelectionRoute, Table, TableQuery, useTableQuery } from "@vivid-planet/react-admin-core";
import { Field, Input } from "@vivid-planet/react-admin-form";
import { FixedLeftRightLayout } from "@vivid-planet/react-admin-layout";
import gql from "graphql-tag";
import * as React from "react";
import { Redirect, Route, Switch } from "react-router";
import StoryRouter from "storybook-react-router";
import { apolloStoryDecorator } from "../apollo-story.decorator";

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
            onSubmit={values => {
                // submit here
            }}
            initialValues={props.user}
        >
            <Field label="Name" name="name" defaultOptions required component={Input} />
        </FinalForm>
    );
}

function Story() {
    const { tableData, api, loading, error } = useTableQuery<IQueryData, {}>()(query, {
        resolveTableData: data => ({
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
                        <FixedLeftRightLayout>
                            <FixedLeftRightLayout.Left>
                                <ExampleTable tableData={tableData} selectedId={selectedId} selectionApi={selectionApi} />
                            </FixedLeftRightLayout.Left>
                            <FixedLeftRightLayout.Right>
                                <Selected selectionMode={selectionMode} selectedId={selectedId} rows={tableData.data}>
                                    {(user, { selectionMode: selectedSelectionMode }) => <ExampleForm mode={selectedSelectionMode} user={user} />}
                                </Selected>
                            </FixedLeftRightLayout.Right>
                        </FixedLeftRightLayout>
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

storiesOf("react-admin-core", module)
    .addDecorator(apolloStoryDecorator())
    .addDecorator(StoryRouter())
    .add("Table Besides Form", () => <App />);

import { ApolloProvider } from "@apollo/react-hooks";
import { Button, IconButton, Toolbar, Typography } from "@material-ui/core";
import { Add as AddIcon, Edit as EditIcon } from "@material-ui/icons";
import { storiesOf } from "@storybook/react";
import { FinalForm, IEditDialogApi, Selected, Table, useAddDialog, useEditDialog } from "@vivid-planet/react-admin-core";
import { TextField } from "@vivid-planet/react-admin-final-form-material-ui";
import { Field } from "@vivid-planet/react-admin-form";
import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { ApolloLink } from "apollo-link";
import { RestLink } from "apollo-link-rest";
import * as React from "react";
import StoryRouter from "storybook-react-router";

interface IExampleRow {
    id: number;
    foo: string;
    bar: string;
}

function Story() {
    const data: IExampleRow[] = [
        { id: 1, foo: "blub", bar: "blub" },
        { id: 2, foo: "blub1", bar: "blub1" },
    ];

    const [AddDialog, addDialogApi] = useAddDialog();
    const [EditDialog, editDialogApi] = useEditDialog(data);

    return (
        <>
            <Toolbar>
                <Button
                    color="default"
                    endIcon={<AddIcon />}
                    onClick={ev => {
                        addDialogApi.open();
                    }}
                >
                    <Typography variant="button">Hinzufügen</Typography>
                </Button>
            </Toolbar>
            <Table
                data={data}
                totalCount={data.length}
                columns={[
                    {
                        name: "foo",
                        header: "Foo",
                    },
                    {
                        name: "bar",
                        header: "Bar",
                    },
                    {
                        name: "edit",
                        header: "Edit",
                        render: row => (
                            <IconButton
                                onClick={ev => {
                                    editDialogApi.open(String(row.id));
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                        ),
                    },
                ]}
            />
            <AddDialog>
                <FinalForm
                    mode="add"
                    onSubmit={values => {
                        alert(JSON.stringify(values));
                    }}
                >
                    <Field name="foo" component={TextField} type="text" label="Name" />
                </FinalForm>
            </AddDialog>
            <EditDialog>
                {(row: IExampleRow) => (
                    <FinalForm
                        mode="edit"
                        initialValues={row}
                        onSubmit={values => {
                            alert(JSON.stringify(values));
                        }}
                    >
                        <Field name="foo" component={TextField} type="text" label="Name" />
                    </FinalForm>
                )}
            </EditDialog>
        </>
    );
}

storiesOf("react-admin-core", module)
    .addDecorator(StoryRouter())
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
    .add("Table EditDialog Hooks", () => <Story />);

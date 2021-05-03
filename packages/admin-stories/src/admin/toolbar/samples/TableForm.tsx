import {
    IStackSwitchApi,
    MainContent,
    Stack,
    StackPage,
    StackSwitch,
    Table,
    Toolbar,
    ToolbarBackButton,
    ToolbarTitleItem,
    useStackSwitchApi,
} from "@comet/admin";
import { Add, Delete, Edit } from "@comet/admin-icons";
import { Button, IconButton, Typography } from "@material-ui/core";
import * as React from "react";

interface IExampleRow {
    id: number;
    foo1: string;
    foo2: string;
    nestedFoo: {
        foo: string;
    };
}

const sampleData = [...new Array(40)].map((value, index) => {
    return { id: index, foo1: `bar-${index}`, foo2: `bar-${index}`, nestedFoo: { foo: `bar-${index}` } };
});

export const ToolbarTableForm = () => {
    const [data, setData] = React.useState<Array<IExampleRow>>(sampleData);
    const onDeleteItem = (id: number) => {
        setData([...data.filter((item) => item.id != id)]);
    };
    const ExampleTable = () => {
        const stackSwitchApi = useStackSwitchApi();
        return (
            <>
                <Toolbar
                    actionItems={(stackSwitchApi: IStackSwitchApi | undefined) => (
                        <>
                            <Button
                                variant={"contained"}
                                color={"primary"}
                                startIcon={<Add />}
                                onClick={() => {
                                    stackSwitchApi?.activatePage("create", "new");
                                }}
                            >
                                <Typography>Add</Typography>
                            </Button>
                        </>
                    )}
                >
                    <ToolbarBackButton />
                    <ToolbarTitleItem />
                </Toolbar>
                <MainContent>
                    <Table
                        data={data}
                        totalCount={data.length}
                        columns={[
                            {
                                name: "foo1",
                                header: "Foo1",
                            },
                            {
                                name: "foo2",
                                header: "Foo2",
                                render: (row) => <strong>{row.id}</strong>,
                            },
                            {
                                name: "bar",
                                visible: false,
                            },
                            {
                                name: "nestedFoo.foo",
                                header: "Nested foo",
                            },
                            {
                                name: "actions",
                                header: "",
                                render: (row: IExampleRow) => (
                                    <>
                                        <IconButton
                                            onClick={() => {
                                                stackSwitchApi?.activatePage("edit", row.id.toString(10));
                                            }}
                                        >
                                            <Edit color={"primary"} />
                                        </IconButton>

                                        <IconButton
                                            onClick={() => {
                                                onDeleteItem(row.id);
                                            }}
                                        >
                                            <Delete color={"primary"} />
                                        </IconButton>
                                    </>
                                ),
                            },
                        ]}
                    />
                </MainContent>
            </>
        );
    };
    const ExampleDetails = ({ mode, id }: { mode: "edit" | "create"; id: string }) => {
        const item = data.find((element) => element.id.toString(10) === id);

        return (
            <>
                <Toolbar>
                    <ToolbarBackButton />
                    <ToolbarTitleItem title={<Typography variant={"h4"}>{mode === "create" ? "Create" : `Edit Id: ${id}`}</Typography>} />
                </Toolbar>
                <MainContent>
                    {mode === "create" ? (
                        <Typography>Create a new data set not implemented</Typography>
                    ) : (
                        <>
                            <Typography>Example Details to id {id}</Typography>
                            <Typography>{JSON.stringify(item)}</Typography>
                        </>
                    )}
                </MainContent>
            </>
        );
    };

    return (
        <Stack topLevelTitle={"Table / Form"} showBreadcrumbs={false} showBackButton={false}>
            <StackSwitch initialPage="table">
                <StackPage name="table">
                    <ExampleTable />
                </StackPage>
                <StackPage name="create">
                    {(selectedId: string) => {
                        return <ExampleDetails mode={"create"} id={selectedId} />;
                    }}
                </StackPage>

                <StackPage name="edit">
                    {(selectedId: string) => {
                        return <ExampleDetails mode="edit" id={selectedId} />;
                    }}
                </StackPage>
            </StackSwitch>
        </Stack>
    );
};

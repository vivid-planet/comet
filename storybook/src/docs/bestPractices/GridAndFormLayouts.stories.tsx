import {
    AppHeader,
    AppHeaderMenuButton,
    CancelButton,
    CrudMoreActionsMenu,
    DataGridToolbar,
    FieldSet,
    FinalForm,
    FormSection,
    GridColDef,
    GridFilterButton,
    Loading,
    MainContent,
    MasterLayout,
    Menu,
    MenuItemRouterLink,
    OkayButton,
    RouterTab,
    RouterTabs,
    SaveBoundary,
    SaveBoundarySaveButton,
    Stack,
    StackLink,
    StackPage,
    StackPageTitle,
    StackSwitch,
    StackToolbar,
    TextAreaField,
    TextField,
    ToolbarActions,
    ToolbarAutomaticTitleItem,
    ToolbarBackButton,
    ToolbarFillSpace,
    ToolbarItem,
    useSaveBoundaryApi,
} from "@comet/admin";
import { Add, Dashboard, Edit, Html, Select as SelectIcon } from "@comet/admin-icons";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { DataGrid, GridSelectionModel, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { StoryContext } from "@storybook/addons";
import { storiesOf } from "@storybook/react";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Route } from "react-router";

import { storyRouterDecorator } from "../../story-router.decorator";

const LOADING_DURATION = 1000;

type FormValues = {
    id: string;
    title: string;
    description?: string;
};

const exampleRows: FormValues[] = [
    {
        id: "91cd6f82-88f6-491d-905c-7b51526b3cc2",
        title: "Example Item 1",
        description: "Nullam quis risus eget urna mollis ornare vel eu leo. Nullam quis risus eget urna mollis ornare vel eu leo.",
    },
    {
        id: "83962ba7-96f3-49c6-95d6-d1fdae3bc773",
        title: "Example Item 2",
        description:
            "Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Cras mattis consectetur purus sit amet fermentum.",
    },
    {
        id: "d5dcd014-8dd5-4563-9f05-41903070d20c",
        title: "Example Item 3",
        description: "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Etiam porta sem malesuada magna mollis euismod.",
    },
];

const useData = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false);
        }, LOADING_DURATION);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    return { rows: loading ? [] : exampleRows, loading };
};

const MasterHeader = () => (
    <AppHeader>
        <AppHeaderMenuButton />
    </AppHeader>
);

const MasterMenu = () => (
    <Menu>
        <MenuItemRouterLink primary="This page" to="/example-page" icon={<Dashboard />} />
    </Menu>
);

function stackDecorator() {
    return (Story: React.ComponentType, c: StoryContext) => {
        return (
            <Route
                render={() => (
                    <Stack topLevelTitle="Example Stack Root">
                        <Story />
                    </Stack>
                )}
            />
        );
    };
}

function masterLayoutDecorator() {
    return (Story: React.ComponentType, c: StoryContext) => {
        return (
            <MasterLayout menuComponent={MasterMenu} headerComponent={MasterHeader}>
                <Story />
            </MasterLayout>
        );
    };
}

storiesOf("stories/bestPractices/gridAndFormLayouts", module)
    .addParameters({
        layout: "none",
        docs: {
            inlineStories: false,
        },
    })
    .addDecorator(masterLayoutDecorator())
    .addDecorator(stackDecorator())
    .addDecorator(storyRouterDecorator())
    .add("Simple form on a page", () => {
        const Form = ({ id }: { id?: string }) => {
            const { rows, loading } = useData();
            const editingExistingItem = Boolean(id);

            if (editingExistingItem && loading) {
                return <Loading />;
            }

            return (
                <FinalForm
                    onSubmit={() => {
                        // Submit data
                    }}
                    mode={editingExistingItem ? "edit" : "add"}
                    initialValues={rows.find((row) => row.id === id)}
                >
                    <TextField name="title" required fullWidth variant="horizontal" label="Title" />
                    <TextAreaField name="description" fullWidth variant="horizontal" label="Description" />
                </FinalForm>
            );
        };

        const editingId: string | undefined = undefined; // In a real application, this would be set when editing an existing item

        return (
            <SaveBoundary>
                <StackToolbar>
                    <ToolbarBackButton />
                    <ToolbarAutomaticTitleItem />
                    <ToolbarFillSpace />
                    <ToolbarActions>
                        <SaveBoundarySaveButton />
                    </ToolbarActions>
                </StackToolbar>
                <MainContent>
                    <FieldSet>
                        <Form id={editingId} />
                    </FieldSet>
                </MainContent>
            </SaveBoundary>
        );
    })
    .add("Large form on a page", () => {
        const Form = ({ id }: { id?: string }) => {
            const { rows, loading } = useData();
            const editingExistingItem = Boolean(id);

            if (editingExistingItem && loading) {
                return <Loading />;
            }

            return (
                <FinalForm
                    onSubmit={() => {
                        // Submit data
                    }}
                    mode={editingExistingItem ? "edit" : "add"}
                    initialValues={rows.find((row) => row.id === id)}
                >
                    <FieldSet title="General information">
                        <TextField name="title" required fullWidth variant="horizontal" label="Title" />
                        <TextAreaField name="description" fullWidth variant="horizontal" label="Description" />
                    </FieldSet>
                    <FieldSet title="Address">
                        <TextField name="street" fullWidth variant="horizontal" label="Street" />
                        <TextField name="zipCode" fullWidth variant="horizontal" label="Zip code" />
                        <TextField name="city" fullWidth variant="horizontal" label="City" />
                    </FieldSet>
                    <FieldSet title="Contact information">
                        <TextField name="email" fullWidth variant="horizontal" label="Email" />
                        <TextField name="phone" fullWidth variant="horizontal" label="Phone" />
                    </FieldSet>
                </FinalForm>
            );
        };

        const editingId: string | undefined = undefined; // In a real application, this would be set when editing an existing item

        return (
            <SaveBoundary>
                <StackToolbar>
                    <ToolbarBackButton />
                    <ToolbarAutomaticTitleItem />
                    <ToolbarFillSpace />
                    <ToolbarActions>
                        <SaveBoundarySaveButton />
                    </ToolbarActions>
                </StackToolbar>
                <MainContent>
                    <Form id={editingId} />
                </MainContent>
            </SaveBoundary>
        );
    })
    .add("Simple form in a Dialog", () => {
        const Form = ({ id }: { id?: string }) => {
            const { rows, loading } = useData();
            const editingExistingItem = Boolean(id);

            if (editingExistingItem && loading) {
                return <Loading />;
            }

            return (
                <FinalForm
                    onSubmit={() => {
                        // Submit data
                    }}
                    mode={editingExistingItem ? "edit" : "add"}
                    initialValues={rows.find((row) => row.id === id)}
                >
                    <TextField name="title" required fullWidth variant="horizontal" label="Title" />
                    <TextAreaField name="description" fullWidth variant="horizontal" label="Description" />
                </FinalForm>
            );
        };

        const [showDialog, setShowDialog] = useState(true); // In a real application, this would generally be `false` by default
        const editingId: string | undefined = undefined; // In a real application, this would be set when editing an existing item

        return (
            <SaveBoundary>
                <StackToolbar>
                    <ToolbarBackButton />
                    <ToolbarAutomaticTitleItem />
                    <ToolbarFillSpace />
                    <ToolbarActions>
                        <Button color="primary" variant="contained" onClick={() => setShowDialog(true)}>
                            Open dialog
                        </Button>
                    </ToolbarActions>
                </StackToolbar>
                <MainContent>
                    <Typography variant="h3">Open the dialog to see the form.</Typography>
                    <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
                        <DialogTitle>Dialog title</DialogTitle>
                        <DialogContent>
                            <Form id={editingId} />
                        </DialogContent>
                        <DialogActions>
                            <CancelButton onClick={() => setShowDialog(false)}>Cancel</CancelButton>
                            <BetterSaveBoundarySaveButton
                                onSave={(success) => {
                                    if (success) {
                                        setShowDialog(false);
                                    }
                                }}
                            />
                        </DialogActions>
                    </Dialog>
                </MainContent>
            </SaveBoundary>
        );
    })
    .add("Large form in a Dialog", () => {
        const Form = ({ id }: { id?: string }) => {
            const { rows, loading } = useData();
            const editingExistingItem = Boolean(id);

            if (editingExistingItem && loading) {
                return <Loading />;
            }

            return (
                <FinalForm
                    onSubmit={() => {
                        // Submit data
                    }}
                    mode={editingExistingItem ? "edit" : "add"}
                    initialValues={rows.find((row) => row.id === id)}
                >
                    <FormSection title="General information">
                        <TextField name="title" required fullWidth variant="horizontal" label="Title" />
                        <TextAreaField name="description" fullWidth variant="horizontal" label="Description" />
                    </FormSection>
                    <FormSection title="Address">
                        <TextField name="street" fullWidth variant="horizontal" label="Street" />
                        <TextField name="zipCode" fullWidth variant="horizontal" label="Zip code" />
                        <TextField name="city" fullWidth variant="horizontal" label="City" />
                    </FormSection>
                    <FormSection title="Contact information">
                        <TextField name="email" fullWidth variant="horizontal" label="Email" />
                        <TextField name="phone" fullWidth variant="horizontal" label="Phone" />
                    </FormSection>
                </FinalForm>
            );
        };

        const [showDialog, setShowDialog] = useState(true); // In a real application, this would generally be `false` by default
        const editingId: string | undefined = undefined; // In a real application, this would be set when editing an existing item

        return (
            <SaveBoundary>
                <StackToolbar>
                    <ToolbarBackButton />
                    <ToolbarAutomaticTitleItem />
                    <ToolbarFillSpace />
                    <ToolbarActions>
                        <Button color="primary" variant="contained" onClick={() => setShowDialog(true)}>
                            Open dialog
                        </Button>
                    </ToolbarActions>
                </StackToolbar>
                <MainContent>
                    <Typography variant="h3">Open the dialog to see the form.</Typography>
                    <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
                        <DialogTitle>Dialog title</DialogTitle>
                        <DialogContent>
                            <Form id={editingId} />
                        </DialogContent>
                        <DialogActions>
                            <CancelButton onClick={() => setShowDialog(false)}>Cancel</CancelButton>
                            <BetterSaveBoundarySaveButton
                                onSave={(success) => {
                                    if (success) {
                                        setShowDialog(false);
                                    }
                                }}
                            />
                        </DialogActions>
                    </Dialog>
                </MainContent>
            </SaveBoundary>
        );
    })
    .add("Single Grid (full height)", () => {
        const { rows, loading } = useData();

        const GridToolbar = () => {
            return (
                <DataGridToolbar>
                    <ToolbarItem>
                        <GridToolbarQuickFilter />
                    </ToolbarItem>
                    <ToolbarItem>
                        <GridFilterButton />
                    </ToolbarItem>
                </DataGridToolbar>
            );
        };

        const columns: GridColDef[] = [
            { field: "title", headerName: "Title", flex: 1 },
            { field: "description", headerName: "Description", flex: 2 },
        ];

        return (
            <>
                <StackToolbar>
                    <ToolbarBackButton />
                    <ToolbarAutomaticTitleItem />
                </StackToolbar>
                <MainContent fullHeight>
                    <DataGrid disableSelectionOnClick columns={columns} rows={rows} loading={loading} components={{ Toolbar: GridToolbar }} />
                </MainContent>
            </>
        );
    })
    .add("Single Grid (auto height)", () => {
        const { rows, loading } = useData();

        const GridToolbar = () => {
            return (
                <DataGridToolbar>
                    <ToolbarItem>
                        <GridToolbarQuickFilter />
                    </ToolbarItem>
                    <ToolbarItem>
                        <GridFilterButton />
                    </ToolbarItem>
                </DataGridToolbar>
            );
        };

        const columns: GridColDef[] = [
            { field: "title", headerName: "Title", flex: 1 },
            { field: "description", headerName: "Description", flex: 2 },
        ];

        return (
            <>
                <StackToolbar>
                    <ToolbarBackButton />
                    <ToolbarAutomaticTitleItem />
                </StackToolbar>
                <MainContent>
                    <DataGrid
                        disableSelectionOnClick
                        columns={columns}
                        rows={rows}
                        loading={loading}
                        components={{ Toolbar: GridToolbar }}
                        autoHeight
                    />
                </MainContent>
            </>
        );
    })
    .add("Grid with Form Dialog", () => {
        const Form = ({ id }: { id?: string }) => {
            const { rows, loading } = useData();
            const editingExistingItem = Boolean(id);

            if (editingExistingItem && loading) {
                return <Loading />;
            }

            return (
                <FinalForm
                    onSubmit={() => {
                        // Submit data
                    }}
                    mode={editingExistingItem ? "edit" : "add"}
                    initialValues={rows.find((row) => row.id === id)}
                >
                    <TextField name="title" required fullWidth variant="horizontal" label="Title" />
                    <TextAreaField name="description" fullWidth variant="horizontal" label="Description" />
                </FinalForm>
            );
        };

        const [editingId, setEditingId] = useState<string | undefined>();
        const { rows, loading } = useData();

        const GridToolbar = () => {
            return (
                <DataGridToolbar>
                    <ToolbarItem>
                        <GridToolbarQuickFilter />
                    </ToolbarItem>
                    <ToolbarItem>
                        <GridFilterButton />
                    </ToolbarItem>
                    <ToolbarFillSpace />
                    <ToolbarActions>
                        <Button color="primary" variant="contained" startIcon={<Add />} onClick={() => setEditingId("add")}>
                            Add new item
                        </Button>
                    </ToolbarActions>
                </DataGridToolbar>
            );
        };

        const columns: GridColDef[] = [
            { field: "title", headerName: "Title", flex: 1 },
            { field: "description", headerName: "Description", flex: 2 },
            {
                field: "actions",
                headerName: "",
                width: 52,
                renderCell: ({ row }) => (
                    <IconButton color="primary" onClick={() => setEditingId(row.id)}>
                        <Edit />
                    </IconButton>
                ),
            },
        ];

        return (
            <>
                <StackToolbar>
                    <ToolbarBackButton />
                    <ToolbarAutomaticTitleItem />
                </StackToolbar>
                <MainContent fullHeight>
                    <DataGrid disableSelectionOnClick rows={rows} columns={columns} loading={loading} components={{ Toolbar: GridToolbar }} />
                </MainContent>
                <Dialog open={!!editingId} onClose={() => setEditingId(undefined)}>
                    <SaveBoundary>
                        <DialogTitle>{editingId === "add" ? "Add new item" : `${rows.find((row) => row.id === editingId)?.title}`}</DialogTitle>
                        <DialogContent>
                            <Form id={editingId === "add" ? undefined : editingId} />
                        </DialogContent>
                        <DialogActions>
                            <CancelButton onClick={() => setEditingId(undefined)}>Cancel</CancelButton>
                            <BetterSaveBoundarySaveButton
                                onSave={(success) => {
                                    if (success) {
                                        setEditingId(undefined);
                                    }
                                }}
                            />
                        </DialogActions>
                    </SaveBoundary>
                </Dialog>
            </>
        );
    })
    .add("Grid with Form Page", () => {
        const Form = ({ id }: { id?: string }) => {
            const { rows, loading } = useData();
            const editingExistingItem = Boolean(id);

            if (editingExistingItem && loading) {
                return <Loading />;
            }

            return (
                <FinalForm
                    onSubmit={() => {
                        // Submit data
                    }}
                    mode={editingExistingItem ? "edit" : "add"}
                    initialValues={rows.find((row) => row.id === id)}
                >
                    <TextField name="title" required fullWidth variant="horizontal" label="Title" />
                    <TextAreaField name="description" fullWidth variant="horizontal" label="Description" />
                </FinalForm>
            );
        };

        const { rows, loading } = useData();

        const GridToolbar = () => {
            return (
                <DataGridToolbar>
                    <ToolbarItem>
                        <GridToolbarQuickFilter />
                    </ToolbarItem>
                    <ToolbarItem>
                        <GridFilterButton />
                    </ToolbarItem>
                    <ToolbarFillSpace />
                    <ToolbarActions>
                        <Button color="primary" variant="contained" startIcon={<Add />} component={StackLink} pageName="add" payload="add">
                            Add new item
                        </Button>
                    </ToolbarActions>
                </DataGridToolbar>
            );
        };

        const columns: GridColDef[] = [
            { field: "title", headerName: "Title", flex: 1 },
            { field: "description", headerName: "Description", flex: 2 },
            {
                field: "actions",
                headerName: "",
                width: 52,
                renderCell: (params) => (
                    <IconButton color="primary" component={StackLink} pageName="edit" payload={params.row.id}>
                        <Edit />
                    </IconButton>
                ),
            },
        ];

        const formToolbar = (
            <StackToolbar>
                <ToolbarBackButton />
                <ToolbarAutomaticTitleItem />
                <ToolbarFillSpace />
                <ToolbarActions>
                    <SaveBoundarySaveButton />
                </ToolbarActions>
            </StackToolbar>
        );

        return (
            <StackSwitch>
                <StackPage name="grid">
                    <StackToolbar>
                        <ToolbarBackButton />
                        <ToolbarAutomaticTitleItem />
                    </StackToolbar>
                    <MainContent fullHeight>
                        <DataGrid disableSelectionOnClick rows={rows} columns={columns} loading={loading} components={{ Toolbar: GridToolbar }} />
                    </MainContent>
                </StackPage>
                <StackPage name="add">
                    <SaveBoundary>
                        <StackPageTitle title="Add new item">{formToolbar}</StackPageTitle>
                        <MainContent>
                            <FieldSet>
                                <Form />
                            </FieldSet>
                        </MainContent>
                    </SaveBoundary>
                </StackPage>
                <StackPage name="edit">
                    {(id) => {
                        return (
                            <SaveBoundary>
                                <StackPageTitle title={rows.find((row) => row.id === id)?.title}>{formToolbar}</StackPageTitle>
                                <MainContent>
                                    <FieldSet>
                                        <Form id={id} />
                                    </FieldSet>
                                </MainContent>
                            </SaveBoundary>
                        );
                    }}
                </StackPage>
            </StackSwitch>
        );
    })
    .add("Nested Grids and Forms with Tabs", () => {
        const Form = ({ id }: { id?: string }) => {
            const { rows, loading } = useData();
            const editingExistingItem = Boolean(id);

            if (editingExistingItem && loading) {
                return <Loading />;
            }

            return (
                <FinalForm
                    onSubmit={() => {
                        // Submit data
                    }}
                    mode={editingExistingItem ? "edit" : "add"}
                    initialValues={rows.find((row) => row.id === id)}
                >
                    <TextField name="title" required fullWidth variant="horizontal" label="Title" />
                    <TextAreaField name="description" fullWidth variant="horizontal" label="Description" />
                </FinalForm>
            );
        };

        const [showAddDialog, setShowAddDialog] = useState(false);
        const { rows, loading } = useData();

        const GridToolbar = () => {
            return (
                <DataGridToolbar>
                    <ToolbarItem>
                        <GridToolbarQuickFilter />
                    </ToolbarItem>
                    <ToolbarItem>
                        <GridFilterButton />
                    </ToolbarItem>
                    <ToolbarFillSpace />
                    <ToolbarActions>
                        <Button color="primary" variant="contained" startIcon={<Add />} onClick={() => setShowAddDialog(true)}>
                            Add new item
                        </Button>
                    </ToolbarActions>
                </DataGridToolbar>
            );
        };

        const columns: GridColDef[] = [
            { field: "title", headerName: "Title", flex: 1 },
            { field: "description", headerName: "Description", flex: 2 },
            {
                field: "actions",
                headerName: "",
                width: 52,
                renderCell: (params) => (
                    <IconButton color="primary" component={StackLink} pageName="edit" payload={params.row.id}>
                        <Edit />
                    </IconButton>
                ),
            },
        ];

        const childGridColumns: GridColDef[] = [
            { field: "title", headerName: "Title", flex: 1 },
            { field: "description", headerName: "Description", flex: 2 },
        ];

        const formToolbar = (
            <StackToolbar>
                <ToolbarBackButton />
                <ToolbarAutomaticTitleItem />
                <ToolbarFillSpace />
                <ToolbarActions>
                    <SaveBoundarySaveButton />
                </ToolbarActions>
            </StackToolbar>
        );

        return (
            <>
                <StackSwitch>
                    <StackPage name="grid">
                        <StackToolbar>
                            <ToolbarBackButton />
                            <ToolbarAutomaticTitleItem />
                        </StackToolbar>
                        <MainContent fullHeight>
                            <DataGrid disableSelectionOnClick rows={rows} columns={columns} loading={loading} components={{ Toolbar: GridToolbar }} />
                        </MainContent>
                    </StackPage>
                    <StackPage name="edit">
                        {(id) => {
                            return (
                                <SaveBoundary>
                                    <StackPageTitle title={rows.find((row) => row.id === id)?.title}>{formToolbar}</StackPageTitle>
                                    <MainContent>
                                        <RouterTabs>
                                            <RouterTab path="" label="Details Form">
                                                <FieldSet>
                                                    <Form id={id} />
                                                </FieldSet>
                                            </RouterTab>
                                            <RouterTab path="/child-items" label="Child items in Grid">
                                                <FullHeightGridContainer>
                                                    <DataGrid disableSelectionOnClick rows={rows} columns={childGridColumns} loading={loading} />
                                                </FullHeightGridContainer>
                                            </RouterTab>
                                        </RouterTabs>
                                    </MainContent>
                                </SaveBoundary>
                            );
                        }}
                    </StackPage>
                </StackSwitch>
                <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)}>
                    <SaveBoundary>
                        <DialogTitle>Add new item</DialogTitle>
                        <DialogContent>
                            <Form />
                        </DialogContent>
                        <DialogActions>
                            <CancelButton onClick={() => setShowAddDialog(false)}>Cancel</CancelButton>
                            <BetterSaveBoundarySaveButton
                                onSave={(success) => {
                                    if (success) {
                                        setShowAddDialog(false);
                                    }
                                }}
                            />
                        </DialogActions>
                    </SaveBoundary>
                </Dialog>
            </>
        );
    })
    .add("Grid with selection and more actions menu", () => {
        const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
        const { rows, loading } = useData();

        const GridToolbar = () => {
            return (
                <DataGridToolbar>
                    <ToolbarItem>
                        <GridToolbarQuickFilter />
                    </ToolbarItem>
                    <ToolbarItem>
                        <GridFilterButton />
                    </ToolbarItem>
                    <ToolbarFillSpace />
                    <ToolbarActions>
                        <CrudMoreActionsMenu
                            selectionSize={selectionModel.length}
                            overallActions={[
                                {
                                    label: "Log all items to the console",
                                    icon: <Html />,
                                    onClick: () => {
                                        console.log(
                                            "IDs of all items",
                                            rows.map((row) => row.id),
                                        );
                                    },
                                },
                            ]}
                            selectiveActions={[
                                {
                                    label: "Log selected items to the console",
                                    icon: <Html />,
                                    onClick: () => {
                                        console.log("IDs of selected items", selectionModel);
                                    },
                                },
                            ]}
                        />
                    </ToolbarActions>
                </DataGridToolbar>
            );
        };

        const columns: GridColDef[] = [
            { field: "title", headerName: "Title", flex: 1 },
            { field: "description", headerName: "Description", flex: 2 },
        ];

        return (
            <>
                <StackToolbar>
                    <ToolbarBackButton />
                    <ToolbarAutomaticTitleItem />
                </StackToolbar>
                <MainContent fullHeight>
                    <DataGrid
                        disableSelectionOnClick
                        rows={rows}
                        columns={columns}
                        loading={loading}
                        components={{ Toolbar: GridToolbar }}
                        checkboxSelection
                        selectionModel={selectionModel}
                        onSelectionModelChange={setSelectionModel}
                    />
                </MainContent>
            </>
        );
    })
    .add("Grid with selection in dialog", () => {
        const [showDialog, setShowDialog] = useState(true); // In a real application, this would generally be `false` by default
        const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]); // TODO: Check why this is reset every time the dialog is opened. Is this only in storybook?
        const { rows, loading } = useData();

        const GridToolbar = () => {
            return (
                <DataGridToolbar>
                    <ToolbarItem>
                        <GridToolbarQuickFilter />
                    </ToolbarItem>
                    <ToolbarItem>
                        <GridFilterButton />
                    </ToolbarItem>
                </DataGridToolbar>
            );
        };

        const columns: GridColDef[] = [
            { field: "title", headerName: "Title", flex: 1 },
            { field: "description", headerName: "Description", flex: 2 },
        ];

        return (
            <>
                <StackToolbar>
                    <ToolbarBackButton />
                    <ToolbarAutomaticTitleItem />
                    <ToolbarFillSpace />
                    <ToolbarActions>
                        <Button color="primary" variant="contained" startIcon={<SelectIcon />} onClick={() => setShowDialog(true)}>
                            Select items
                        </Button>
                    </ToolbarActions>
                </StackToolbar>
                <MainContent>
                    {selectionModel.length > 0 ? (
                        <>
                            <Typography variant="h4" gutterBottom>
                                Selected items
                            </Typography>

                            {selectionModel.map((id) => {
                                const row = rows.find((row) => row.id === id);

                                return (
                                    <Typography key={id} gutterBottom>
                                        <strong>{row?.title}</strong>
                                        <br />
                                        {row?.description}
                                    </Typography>
                                );
                            })}
                        </>
                    ) : (
                        <Typography variant="h4">No items selected :(</Typography>
                    )}
                </MainContent>
                <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
                    <DialogTitle>Selected items</DialogTitle>
                    <DataGrid
                        disableSelectionOnClick
                        rows={rows}
                        columns={columns}
                        loading={loading}
                        components={{ Toolbar: GridToolbar }}
                        checkboxSelection
                        autoHeight
                        selectionModel={selectionModel}
                        onSelectionModelChange={setSelectionModel}
                    />
                    <DialogActions>
                        <OkayButton onClick={() => setShowDialog(false)} />
                    </DialogActions>
                </Dialog>
            </>
        );
    });

// TODO: Use new/updated component: https://vivid-planet.atlassian.net/browse/COM-1231
const FullHeightGridContainer = ({ children }: { children: ReactNode }) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const [topOffset, setTopOffset] = useState(0);

    useEffect(() => {
        if (elementRef.current) {
            setTopOffset(elementRef.current.getBoundingClientRect().top);
        }
    }, []);

    return (
        <Box ref={elementRef} height={`calc(100vh - ${topOffset + 20}px)`}>
            {children}
        </Box>
    );
};

// TODO: Replace with updated SaveBoundarySaveButton: https://vivid-planet.atlassian.net/browse/SVK-413
const BetterSaveBoundarySaveButton = ({ onSave }: { onSave?: (success: boolean) => void }) => {
    const saveBoundaryApi = useSaveBoundaryApi();

    return (
        <SaveBoundarySaveButton
            onClick={async () => {
                const success = await saveBoundaryApi?.save();
                onSave?.(Boolean(success));
            }}
        />
    );
};

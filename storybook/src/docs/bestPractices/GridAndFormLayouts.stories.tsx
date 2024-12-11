import {
    CancelButton,
    CrudMoreActionsMenu,
    DataGridToolbar,
    FieldSet,
    FinalForm,
    FormSection,
    GridColDef,
    GridFilterButton,
    Loading,
    OkayButton,
    RouterTab,
    RouterTabs,
    SaveBoundary,
    SaveBoundarySaveButton,
    StackLink,
    StackMainContent,
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
} from "@comet/admin";
import { Add, Edit, Html, Select as SelectIcon } from "@comet/admin-icons";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { DataGrid, GridSelectionModel, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { ReactNode, useEffect, useRef, useState } from "react";

import { masterLayoutDecorator, stackRouteDecorator } from "../../helpers/storyDecorators";
import { storyRouterDecorator } from "../../story-router.decorator";

export default {
    title: "Docs/Best Practices/Grid and Form Layouts",
    decorators: [masterLayoutDecorator(), stackRouteDecorator(), storyRouterDecorator()],
    parameters: {
        layout: "none",
        docs: {
            inlineStories: false,
            story: {
                inline: false,
                iframeHeight: 600,
            },
        },
    },
};

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

export const SimpleFormOnAPage = {
    render: () => {
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
                <StackMainContent>
                    <FieldSet>
                        <Form id={editingId} />
                    </FieldSet>
                </StackMainContent>
            </SaveBoundary>
        );
    },
};

export const LargeFormOnAPage = {
    render: () => {
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
                <StackMainContent>
                    <Form id={editingId} />
                </StackMainContent>
            </SaveBoundary>
        );
    },
};

export const SimpleFormInADialog = {
    render: () => {
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
            <SaveBoundary onAfterSave={() => setShowDialog(false)}>
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
                <StackMainContent>
                    <Typography variant="h3">Open the dialog to see the form.</Typography>
                    <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
                        <DialogTitle>Dialog title</DialogTitle>
                        <DialogContent>
                            <Form id={editingId} />
                        </DialogContent>
                        <DialogActions>
                            <CancelButton onClick={() => setShowDialog(false)} />
                            <SaveBoundarySaveButton />
                        </DialogActions>
                    </Dialog>
                </StackMainContent>
            </SaveBoundary>
        );
    },
};

export const LargeFormInADialog = {
    render: () => {
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
            <SaveBoundary onAfterSave={() => setShowDialog(false)}>
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
                <StackMainContent>
                    <Typography variant="h3">Open the dialog to see the form.</Typography>
                    <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
                        <DialogTitle>Dialog title</DialogTitle>
                        <DialogContent>
                            <Form id={editingId} />
                        </DialogContent>
                        <DialogActions>
                            <CancelButton onClick={() => setShowDialog(false)} />
                            <SaveBoundarySaveButton />
                        </DialogActions>
                    </Dialog>
                </StackMainContent>
            </SaveBoundary>
        );
    },
};

export const SingleGridFullHeight = {
    render: () => {
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
                <StackMainContent fullHeight>
                    <DataGrid disableSelectionOnClick columns={columns} rows={rows} loading={loading} components={{ Toolbar: GridToolbar }} />
                </StackMainContent>
            </>
        );
    },
};

export const SingleGridAutoHeight = {
    render: () => {
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
                <StackMainContent>
                    <DataGrid
                        disableSelectionOnClick
                        columns={columns}
                        rows={rows}
                        loading={loading}
                        components={{ Toolbar: GridToolbar }}
                        autoHeight
                    />
                </StackMainContent>
            </>
        );
    },
};

export const GridWithFormInADialog = {
    render: () => {
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
                <StackMainContent fullHeight>
                    <DataGrid disableSelectionOnClick rows={rows} columns={columns} loading={loading} components={{ Toolbar: GridToolbar }} />
                </StackMainContent>
                <Dialog open={!!editingId} onClose={() => setEditingId(undefined)}>
                    <SaveBoundary onAfterSave={() => setEditingId(undefined)}>
                        <DialogTitle>{editingId === "add" ? "Add new item" : `${rows.find((row) => row.id === editingId)?.title}`}</DialogTitle>
                        <DialogContent>
                            <Form id={editingId === "add" ? undefined : editingId} />
                        </DialogContent>
                        <DialogActions>
                            <CancelButton onClick={() => setEditingId(undefined)} />
                            <SaveBoundarySaveButton />
                        </DialogActions>
                    </SaveBoundary>
                </Dialog>
            </>
        );
    },
};

export const GridWithFormOnAPage = {
    render: () => {
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
                    <StackMainContent fullHeight>
                        <DataGrid disableSelectionOnClick rows={rows} columns={columns} loading={loading} components={{ Toolbar: GridToolbar }} />
                    </StackMainContent>
                </StackPage>
                <StackPage name="add">
                    <SaveBoundary>
                        <StackPageTitle title="Add new item">{formToolbar}</StackPageTitle>
                        <StackMainContent>
                            <FieldSet>
                                <Form />
                            </FieldSet>
                        </StackMainContent>
                    </SaveBoundary>
                </StackPage>
                <StackPage name="edit">
                    {(id) => {
                        return (
                            <SaveBoundary>
                                <StackPageTitle title={rows.find((row) => row.id === id)?.title}>{formToolbar}</StackPageTitle>
                                <StackMainContent>
                                    <FieldSet>
                                        <Form id={id} />
                                    </FieldSet>
                                </StackMainContent>
                            </SaveBoundary>
                        );
                    }}
                </StackPage>
            </StackSwitch>
        );
    },
};

export const NestedGridsAndFormsWithTabs = {
    render: () => {
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
                        <StackMainContent fullHeight>
                            <DataGrid disableSelectionOnClick rows={rows} columns={columns} loading={loading} components={{ Toolbar: GridToolbar }} />
                        </StackMainContent>
                    </StackPage>
                    <StackPage name="edit">
                        {(id) => {
                            return (
                                <SaveBoundary>
                                    <StackPageTitle title={rows.find((row) => row.id === id)?.title}>{formToolbar}</StackPageTitle>
                                    <StackMainContent>
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
                                    </StackMainContent>
                                </SaveBoundary>
                            );
                        }}
                    </StackPage>
                </StackSwitch>
                <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)}>
                    <SaveBoundary onAfterSave={() => setShowAddDialog(false)}>
                        <DialogTitle>Add new item</DialogTitle>
                        <DialogContent>
                            <Form />
                        </DialogContent>
                        <DialogActions>
                            <CancelButton onClick={() => setShowAddDialog(false)} />
                            <SaveBoundarySaveButton />
                        </DialogActions>
                    </SaveBoundary>
                </Dialog>
            </>
        );
    },
};

export const NestedFormInGridInTabsInGrid = {
    render: () => {
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
                        <StackMainContent fullHeight>
                            <DataGrid disableSelectionOnClick rows={rows} columns={columns} loading={loading} components={{ Toolbar: GridToolbar }} />
                        </StackMainContent>
                    </StackPage>
                    <StackPage name="edit">
                        {(id) => {
                            return (
                                <SaveBoundary>
                                    <StackPageTitle title={rows.find((row) => row.id === id)?.title}>{formToolbar}</StackPageTitle>
                                    <StackMainContent>
                                        <RouterTabs>
                                            <RouterTab path="" label="Details Form">
                                                <FieldSet>
                                                    <Form id={id} />
                                                </FieldSet>
                                            </RouterTab>
                                            <RouterTab path="/child-items" label="Child items in Grid">
                                                <StackSwitch>
                                                    <StackPage name="grid">
                                                        <FullHeightGridContainer>
                                                            <DataGrid disableSelectionOnClick rows={rows} columns={columns} loading={loading} />
                                                        </FullHeightGridContainer>
                                                    </StackPage>
                                                    <StackPage name="edit">
                                                        {(id) => {
                                                            return (
                                                                <>
                                                                    <StackPageTitle title={rows.find((row) => row.id === id)?.title}>
                                                                        {formToolbar}
                                                                    </StackPageTitle>
                                                                    <StackMainContent>
                                                                        <FieldSet>
                                                                            <Form id={id} />
                                                                        </FieldSet>
                                                                    </StackMainContent>
                                                                </>
                                                            );
                                                        }}
                                                    </StackPage>
                                                </StackSwitch>
                                            </RouterTab>
                                        </RouterTabs>
                                    </StackMainContent>
                                </SaveBoundary>
                            );
                        }}
                    </StackPage>
                </StackSwitch>
                <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)}>
                    <SaveBoundary onAfterSave={() => setShowAddDialog(false)}>
                        <DialogTitle>Add new item</DialogTitle>
                        <DialogContent>
                            <Form />
                        </DialogContent>
                        <DialogActions>
                            <CancelButton onClick={() => setShowAddDialog(false)} />
                            <SaveBoundarySaveButton />
                        </DialogActions>
                    </SaveBoundary>
                </Dialog>
            </>
        );
    },
};

export const GridWithSelectionAndMoreActionsMenu = {
    render: () => {
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
                <StackMainContent fullHeight>
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
                </StackMainContent>
            </>
        );
    },
};

export const GridWithSelectionInDialog = {
    render: () => {
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
                <StackMainContent>
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
                </StackMainContent>
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
    },
};

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

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import * as React from "react";
import { DirtyHandler } from "./DirtyHandler";
import { DirtyHandlerApiContext, IDirtyHandlerApi } from "./DirtyHandlerApiContext";
import { AddDialogApiContext, EditDialogApiContext, IAddDialogApi, IEditDialogApi } from "./EditDialogApiContext";
import { Selected } from "./Selected";
import { ISelectionApi } from "./SelectionApi";
import { useSelectionRoute } from "./SelectionRoute";

interface IProps {
    title: string;
}

export function useAddDialog(): [React.ComponentType, IAddDialogApi] {
    const [Selection, selection, selectionApi] = useSelectionRoute();

    const open = React.useCallback(() => {
        selectionApi.handleAdd();
    }, [selectionApi]);

    const api: IAddDialogApi = {
        open,
    };
    const AddDialogWithHookProps = React.useMemo(() => {
        return (props: {}) => {
            if (selection.id) return <></>;
            return (
                <Selection>
                    <AddDialogApiContext.Provider value={api}>
                        <EditDialogInner {...props} selection={selection} selectionApi={selectionApi} title="Hinzufügen" />
                    </AddDialogApiContext.Provider>
                </Selection>
            );
        };
    }, [selection]);

    return [AddDialogWithHookProps, api];
}

export function useEditDialog(rows: any): [any, IEditDialogApi, string | undefined] {
    const [Selection, selection, selectionApi] = useSelectionRoute();

    const open = React.useCallback(
        (id: string) => {
            selectionApi.handleSelectId(id);
        },
        [selectionApi],
    );
    const api: IEditDialogApi = {
        open,
    };
    const EditDialogWithHookProps = React.useMemo(() => {
        return (props: any) => {
            if (!selection.id) return <></>;
            return (
                <Selected selectionMode="edit" selectedId={selection.id} rows={rows}>
                    {row => (
                        <Selection>
                            <EditDialogApiContext.Provider value={api}>
                                <EditDialogInner
                                    {...props}
                                    selection={selection}
                                    selectionApi={selectionApi}
                                    title="Bearbeiten"
                                    children={props.children(row)}
                                />
                            </EditDialogApiContext.Provider>
                        </Selection>
                    )}
                </Selected>
            );
        };
    }, [selection]);

    return [EditDialogWithHookProps, api, selection.id];
}

interface IHookProps {
    selection: {
        id?: string;
        mode?: "edit" | "add";
    };
    selectionApi: ISelectionApi;
}

const EditDialogInner: React.FunctionComponent<IProps & IHookProps> = ({ selection, selectionApi, title, children }) => {
    let dirtyHandlerApi: IDirtyHandlerApi | undefined;
    const handleSaveClick = () => {
        if (dirtyHandlerApi) {
            dirtyHandlerApi.submitBindings().then(() => {
                setTimeout(() => {
                    selectionApi.handleDeselect();
                });
            });
        }
    };

    const handleCancelClick = () => {
        selectionApi.handleDeselect();
    };
    console.log(selection);
    return (
        <DirtyHandler>
            <Dialog open={!!selection.mode} onClose={handleCancelClick}>
                <div>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>{children}</DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancelClick} color="primary">
                            <Typography variant="button">Abbrechen</Typography>
                        </Button>
                        <DirtyHandlerApiContext.Consumer>
                            {injectedDirtyHandlerApi => {
                                dirtyHandlerApi = injectedDirtyHandlerApi; // TODO replace by ref on <DirtyHandler>
                                return (
                                    <Button onClick={handleSaveClick} color="primary">
                                        <Typography variant="button">Speichern</Typography>
                                    </Button>
                                );
                            }}
                        </DirtyHandlerApiContext.Consumer>
                    </DialogActions>
                </div>
            </Dialog>
        </DirtyHandler>
    );
};

interface IEditDialogHooklessProps extends IProps {
    children: (injectedProps: { selectedId?: string; selectionMode?: "edit" | "add" }) => React.ReactNode;
}

const EditDialogHooklessInner: React.RefForwardingComponent<IEditDialogApi, IEditDialogHooklessProps> = ({ children }, ref) => {
    const [EditDialogConfigured, api, selectedId] = useEditDialog([]);
    React.useImperativeHandle(ref, () => api);
    return <EditDialogConfigured>{children({ selectedId, selectionMode: "edit" })}</EditDialogConfigured>;
};
export const EditDialog = React.forwardRef(EditDialogHooklessInner);

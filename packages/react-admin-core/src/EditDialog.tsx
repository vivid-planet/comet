import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import * as React from "react";
import { DirtyHandler } from "./DirtyHandler";
import { DirtyHandlerApiContext, IDirtyHandlerApi } from "./DirtyHandlerApiContext";
import { EditDialogApiContext, IEditDialogApi } from "./EditDialogApiContext";
import { ISelectionApi } from "./SelectionApi";
import { SelectionRoute } from "./SelectionRoute";

interface ITitle {
    edit: string;
    add: string;
}

interface IProps {
    title?: ITitle | string;
    children: (injectedProps: { selectedId?: string; selectionMode?: "edit" | "add" }) => React.ReactNode;
}

const EditDialogInner: React.RefForwardingComponent<IEditDialogApi, IProps> = (
    { children, title = { edit: "Bearbeiten", add: "Hinzufügen" } }: IProps,
    ref,
) => {
    const selectionRef = React.useRef<SelectionRoute>(null);
    const openAddDialog = React.useCallback(() => {
        if (selectionRef.current) selectionRef.current.selectionApi.handleAdd();
    }, [selectionRef]);

    const openEditDialog = React.useCallback(
        (id: string) => {
            if (selectionRef.current) selectionRef.current.selectionApi.handleSelectId(id);
        },
        [selectionRef],
    );

    const api: IEditDialogApi = React.useMemo(
        () => ({
            openAddDialog,
            openEditDialog,
        }),
        [openAddDialog, openEditDialog],
    );
    React.useImperativeHandle(ref, () => api);

    let dirtyHandlerApi: IDirtyHandlerApi | undefined;
    const handleSaveClick = () => {
        if (dirtyHandlerApi) {
            dirtyHandlerApi.submitBindings().then(() => {
                selectionRef.current?.selectionApi.handleDeselect();
            });
        }
    };

    const handleCancelClick = () => {
        selectionRef.current?.selectionApi.handleDeselect();
    };

    return (
        <EditDialogApiContext.Provider value={api}>
            <DirtyHandler>
                <SelectionRoute ref={selectionRef}>
                    {({ selectedId, selectionMode, selectionApi }) => (
                        <Dialog open={!!selectionMode} onClose={handleCancelClick}>
                            <div>
                                <DialogTitle>{typeof title === "string" ? title : selectionMode === "edit" ? title.edit : title.add}</DialogTitle>
                                <DialogContent>{children({ selectedId, selectionMode })}</DialogContent>
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
                    )}
                </SelectionRoute>
            </DirtyHandler>
        </EditDialogApiContext.Provider>
    );
};
export const EditDialog = React.forwardRef(EditDialogInner);

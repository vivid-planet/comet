import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import * as React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { DirtyHandler } from "./DirtyHandler";
import { DirtyHandlerApiContext, IDirtyHandlerApi } from "./DirtyHandlerApiContext";
import { EditDialogApiContext, IEditDialogApi } from "./EditDialogApiContext";
import { ISelectionApi } from "./SelectionApi";
import { useSelectionRoute } from "./SelectionRoute";

interface ITitle {
    edit: string;
    add: string;
}

interface IProps {
    title?: ITitle | string;
}

const messages = defineMessages({
    edit: {
        id: "reactAdmin.core.editDialog.edit",
        defaultMessage: "Bearbeiten",
    },
    add: {
        id: "reactAdmin.core.editDialog.add",
        defaultMessage: "Hinzufügen",
    },
});

export function useEditDialog(): [React.ComponentType<IProps>, { id?: string; mode?: "edit" | "add" }, IEditDialogApi] {
    const [Selection, selection, selectionApi] = useSelectionRoute();

    const openAddDialog = React.useCallback(
        (id?: string) => {
            selectionApi.handleAdd(id);
        },
        [selectionApi],
    );

    const openEditDialog = React.useCallback(
        (id: string) => {
            selectionApi.handleSelectId(id);
        },
        [selectionApi],
    );

    const api: IEditDialogApi = {
        openAddDialog,
        openEditDialog,
    };
    const EditDialogWithHookProps = React.useMemo(() => {
        return (props: IProps) => {
            return (
                <Selection>
                    <EditDialogInner {...props} selection={selection} selectionApi={selectionApi} api={api} />
                </Selection>
            );
        };
    }, [selection]);

    return [EditDialogWithHookProps, selection, api];
}

interface IHookProps {
    selection: {
        id?: string;
        mode?: "edit" | "add";
    };
    selectionApi: ISelectionApi;
    api: IEditDialogApi;
}

const EditDialogInner: React.FunctionComponent<IProps & IHookProps> = ({ selection, selectionApi, api, title: maybeTitle, children }) => {
    const intl = useIntl();

    const title = maybeTitle ?? {
        edit: intl.formatMessage(messages.edit),
        add: intl.formatMessage(messages.add),
    };

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

    return (
        <EditDialogApiContext.Provider value={api}>
            <DirtyHandler>
                <Dialog open={!!selection.mode} onClose={handleCancelClick}>
                    <div>
                        <DialogTitle>{typeof title === "string" ? title : selection.mode === "edit" ? title.edit : title.add}</DialogTitle>
                        <DialogContent>{children}</DialogContent>
                        <DialogActions>
                            <Button onClick={handleCancelClick} color="primary">
                                <Typography variant="button">
                                    <FormattedMessage
                                        id="reactAdmin.core.editDialog.cancel"
                                        defaultMessage="Abbrechen"
                                        description="Button to discard the changes of the dialog"
                                    />
                                </Typography>
                            </Button>
                            <DirtyHandlerApiContext.Consumer>
                                {(injectedDirtyHandlerApi) => {
                                    dirtyHandlerApi = injectedDirtyHandlerApi; // TODO replace by ref on <DirtyHandler>
                                    return (
                                        <Button onClick={handleSaveClick} color="primary">
                                            <Typography variant="button">
                                                <FormattedMessage
                                                    id="reactAdmin.core.editDialog.save"
                                                    defaultMessage="Speichern"
                                                    description="Button to save the changes of the dialog"
                                                />
                                            </Typography>
                                        </Button>
                                    );
                                }}
                            </DirtyHandlerApiContext.Consumer>
                        </DialogActions>
                    </div>
                </Dialog>
            </DirtyHandler>
        </EditDialogApiContext.Provider>
    );
};

interface IEditDialogHooklessProps extends IProps {
    children: (injectedProps: { selectedId?: string; selectionMode?: "edit" | "add" }) => React.ReactNode;
}

const EditDialogHooklessInner: React.RefForwardingComponent<IEditDialogApi, IEditDialogHooklessProps> = ({ children, title }, ref) => {
    const [EditDialogConfigured, selection, api] = useEditDialog();
    React.useImperativeHandle(ref, () => api);
    return <EditDialogConfigured title={title}>{children({ selectedId: selection.id, selectionMode: selection.mode })}</EditDialogConfigured>;
};
export const EditDialog = React.forwardRef(EditDialogHooklessInner);

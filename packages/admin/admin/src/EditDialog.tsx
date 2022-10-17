import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CancelButton } from "./common/buttons/cancel/CancelButton";
import { SaveButton } from "./common/buttons/save/SaveButton";
import { DirtyHandler } from "./DirtyHandler";
import { DirtyHandlerApiContext, IDirtyHandlerApi } from "./DirtyHandlerApiContext";
import { CloseDialogOptions, EditDialogApiContext, IEditDialogApi } from "./EditDialogApiContext";
import { EditDialogFormApiProvider, useEditDialogFormApi } from "./EditDialogFormApiContext";
import { SubmitResult } from "./form/SubmitResult";
import { messages } from "./messages";
import { ISelectionApi } from "./SelectionApi";
import { useSelectionRoute } from "./SelectionRoute";

interface ITitle {
    edit: React.ReactNode;
    add: React.ReactNode;
}

interface IProps {
    title?: ITitle | string;
}

export function useEditDialog(): [React.ComponentType<IProps>, { id?: string; mode?: "edit" | "add" }, IEditDialogApi, ISelectionApi] {
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

    const closeDialog = React.useCallback(
        (options?: CloseDialogOptions) => {
            const { delay } = { delay: false, ...options };

            if (delay) {
                const duration = typeof delay === "number" ? delay : 1000;
                setTimeout(() => {
                    selectionApi.handleDeselect();
                }, duration);
            } else {
                selectionApi.handleDeselect();
            }
        },
        [selectionApi],
    );

    const api: IEditDialogApi = React.useMemo(() => {
        return {
            openAddDialog,
            openEditDialog,
            closeDialog,
        };
    }, [closeDialog, openAddDialog, openEditDialog]);

    const EditDialogWithHookProps = React.useMemo(() => {
        return (props: IProps) => {
            return (
                <Selection>
                    <EditDialogFormApiProvider>
                        <EditDialogInner {...props} selection={selection} selectionApi={selectionApi} api={api} />
                    </EditDialogFormApiProvider>
                </Selection>
            );
        };
    }, [Selection, api, selection, selectionApi]);

    return [EditDialogWithHookProps, selection, api, selectionApi];
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
    const editDialogFormApi = useEditDialogFormApi();

    const title = maybeTitle ?? {
        edit: intl.formatMessage(messages.edit),
        add: intl.formatMessage(messages.add),
    };

    let dirtyHandlerApi: IDirtyHandlerApi | undefined;
    const handleSaveClick = () => {
        if (dirtyHandlerApi) {
            dirtyHandlerApi.submitBindings().then((submitResults: Array<SubmitResult>) => {
                const failed = submitResults.some((submitResult) => !!submitResult.error);

                if (!failed) {
                    setTimeout(() => {
                        if (dirtyHandlerApi) dirtyHandlerApi.resetBindings();
                        api.closeDialog({ delay: true });
                    });
                }
            });
        }
    };

    const handleCancelClick = () => {
        if (dirtyHandlerApi) dirtyHandlerApi.resetBindings();
        api.closeDialog();
    };

    const handleCloseClick = () => {
        api.closeDialog();
    };

    return (
        <EditDialogApiContext.Provider value={api}>
            <DirtyHandler>
                <Dialog open={!!selection.mode} onClose={handleCloseClick}>
                    <div>
                        <DialogTitle>{typeof title === "string" ? title : selection.mode === "edit" ? title.edit : title.add}</DialogTitle>
                        <DialogContent>{children}</DialogContent>
                        <DialogActions>
                            <CancelButton onClick={handleCancelClick} />
                            <DirtyHandlerApiContext.Consumer>
                                {(injectedDirtyHandlerApi) => {
                                    dirtyHandlerApi = injectedDirtyHandlerApi; // TODO replace by ref on <DirtyHandler>
                                    return (
                                        <SaveButton
                                            saving={editDialogFormApi?.saving}
                                            hasErrors={editDialogFormApi?.hasErrors}
                                            onClick={handleSaveClick}
                                        >
                                            <FormattedMessage {...messages.save} />
                                        </SaveButton>
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

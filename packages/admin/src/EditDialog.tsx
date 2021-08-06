import { Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import * as React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { CancelButton } from "./common/buttons/cancel/CancelButton";
import { SaveButton } from "./common/buttons/save/SaveButton";
import { DirtyHandler } from "./DirtyHandler";
import { DirtyHandlerApiContext, IDirtyHandlerApi } from "./DirtyHandlerApiContext";
import { EditDialogApiContext, IEditDialogApi } from "./EditDialogApiContext";
import { SubmitResult } from "./form/SubmitResult";
import { ISelectionApi } from "./SelectionApi";
import { useSelectionRoute } from "./SelectionRoute";

interface ITitle {
    edit: React.ReactNode;
    add: React.ReactNode;
}

interface IProps {
    title?: ITitle | string;
}

const messages = defineMessages({
    edit: {
        id: "cometAdmin.generic.edit",
        defaultMessage: "Edit",
    },

    add: {
        id: "cometAdmin.generic.add",
        defaultMessage: "Add",
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

    const api: IEditDialogApi = React.useMemo(() => {
        return {
            openAddDialog,
            openEditDialog,
        };
    }, [openAddDialog, openEditDialog]);

    const EditDialogWithHookProps = React.useMemo(() => {
        return (props: IProps) => {
            return (
                <Selection>
                    <EditDialogInner {...props} selection={selection} selectionApi={selectionApi} api={api} />
                </Selection>
            );
        };
    }, [Selection, api, selection, selectionApi]);

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
            dirtyHandlerApi.submitBindings().then((submitResults: Array<SubmitResult>) => {
                const failed = submitResults.some((submitResult) => !!submitResult.error);

                if (!failed) {
                    setTimeout(() => {
                        selectionApi.handleDeselect();
                    });
                }
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
                            <CancelButton onClick={handleCancelClick} />
                            <DirtyHandlerApiContext.Consumer>
                                {(injectedDirtyHandlerApi) => {
                                    dirtyHandlerApi = injectedDirtyHandlerApi; // TODO replace by ref on <DirtyHandler>
                                    return (
                                        <SaveButton onClick={handleSaveClick}>
                                            <FormattedMessage id="cometAdmin.generic.save" defaultMessage="Save" />
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

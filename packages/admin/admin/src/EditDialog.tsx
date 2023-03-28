import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CancelButton } from "./common/buttons/cancel/CancelButton";
import { SaveButton } from "./common/buttons/save/SaveButton";
import { CloseDialogOptions, EditDialogApiContext, IEditDialogApi } from "./EditDialogApiContext";
import { EditDialogFormApiProvider, useEditDialogFormApi } from "./EditDialogFormApiContext";
import { messages } from "./messages";
import { RouterContext } from "./router/Context";
import { SaveAction } from "./router/PromptHandler";
import { ISelectionApi } from "./SelectionApi";
import { useSelectionRoute } from "./SelectionRoute";

interface ITitle {
    edit: React.ReactNode;
    add: React.ReactNode;
}

interface EditDialogProps {
    title?: ITitle | string;
}

export function useEditDialog(): [React.ComponentType<EditDialogProps>, { id?: string; mode?: "edit" | "add" }, IEditDialogApi, ISelectionApi] {
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

    const parentRouterContext = React.useContext(RouterContext);
    const saveActionRef = React.useRef<SaveAction>();

    const EditDialogWithHookProps = React.useMemo(() => {
        return (props: EditDialogProps) => {
            return (
                <Selection>
                    <EditDialogFormApiProvider>
                        <RouterContext.Provider
                            value={{
                                register: ({ id, path, message, saveAction }) => {
                                    saveActionRef.current = saveAction;
                                    parentRouterContext?.register({ id, path, message, saveAction });
                                },
                                unregister: (id) => {
                                    saveActionRef.current = undefined;
                                    parentRouterContext?.unregister(id);
                                },
                            }}
                        >
                            <EditDialogInner {...props} saveActionRef={saveActionRef} selection={selection} selectionApi={selectionApi} api={api} />
                        </RouterContext.Provider>
                    </EditDialogFormApiProvider>
                </Selection>
            );
        };
    }, [Selection, api, selection, selectionApi, parentRouterContext]);

    return [EditDialogWithHookProps, selection, api, selectionApi];
}

interface IHookProps {
    selection: {
        id?: string;
        mode?: "edit" | "add";
    };
    selectionApi: ISelectionApi;
    api: IEditDialogApi;
    saveActionRef: React.MutableRefObject<SaveAction | undefined>;
}

const EditDialogInner: React.FunctionComponent<EditDialogProps & IHookProps> = ({
    selection,
    selectionApi,
    api,
    saveActionRef,
    title: maybeTitle,
    children,
}) => {
    const intl = useIntl();
    const editDialogFormApi = useEditDialogFormApi();

    const title = maybeTitle ?? {
        edit: intl.formatMessage(messages.edit),
        add: intl.formatMessage(messages.add),
    };

    const handleSaveClick = async () => {
        if (!saveActionRef.current) {
            console.error("Can't save, no RouterPrompt registered with saveAction");
            return;
        }
        const saveResult = await saveActionRef.current();

        if (!saveResult) {
            setTimeout(() => {
                // TODO DirtyHandler removal: do we need a onReset functionality here?
                api.closeDialog({ delay: true });
            });
        }
    };

    const handleCancelClick = () => {
        // TODO DirtyHandler removal: do we need a onReset functionality here?
        api.closeDialog();
    };

    const handleCloseClick = () => {
        api.closeDialog();
    };

    const isOpen = !!selection.mode;

    return (
        <EditDialogApiContext.Provider value={api}>
            <Dialog open={isOpen} onClose={handleCloseClick}>
                <div>
                    <DialogTitle>{typeof title === "string" ? title : selection.mode === "edit" ? title.edit : title.add}</DialogTitle>
                    <DialogContent>{children}</DialogContent>
                    <DialogActions>
                        <CancelButton onClick={handleCancelClick} />
                        <SaveButton saving={editDialogFormApi?.saving} hasErrors={editDialogFormApi?.hasErrors} onClick={handleSaveClick}>
                            <FormattedMessage {...messages.save} />
                        </SaveButton>
                    </DialogActions>
                </div>
            </Dialog>
        </EditDialogApiContext.Provider>
    );
};

interface IEditDialogHooklessProps extends EditDialogProps {
    children: (injectedProps: { selectedId?: string; selectionMode?: "edit" | "add" }) => React.ReactNode;
}

const EditDialogHooklessInner: React.RefForwardingComponent<IEditDialogApi, IEditDialogHooklessProps> = ({ children, title }, ref) => {
    const [EditDialogConfigured, selection, api] = useEditDialog();
    React.useImperativeHandle(ref, () => api);
    return <EditDialogConfigured title={title}>{children({ selectedId: selection.id, selectionMode: selection.mode })}</EditDialogConfigured>;
};
export const EditDialog = React.forwardRef(EditDialogHooklessInner);

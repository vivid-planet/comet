import {
    Dialog,
    DialogActions,
    DialogActionsProps,
    DialogContent,
    DialogContentProps,
    DialogProps,
    DialogTitle,
    DialogTitleProps,
} from "@mui/material";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CancelButton } from "./common/buttons/cancel/CancelButton";
import { SaveButton } from "./common/buttons/save/SaveButton";
import { CloseDialogOptions, EditDialogApiContext, EditDialogOptions, IEditDialogApi } from "./EditDialogApiContext";
import { EditDialogFormApiProvider, useEditDialogFormApi } from "./EditDialogFormApiContext";
import { messages } from "./messages";
import { RouterContext } from "./router/Context";
import { SaveAction } from "./router/PromptHandler";
import { ISelectionApi } from "./SelectionApi";
import { useSelectionRoute } from "./SelectionRoute";

type ITitle = Record<"edit" | "add", React.ReactNode>;

interface EditDialogComponentsProps {
    dialog?: Omit<Partial<DialogProps>, "open" | "onClose">;
    dialogActions?: Partial<DialogActionsProps>;
    dialogContent?: Partial<DialogContentProps>;
    dialogTitle?: Partial<DialogTitleProps>;
}

interface EditDialogProps {
    title?: ITitle | string;
    disableCloseAfterSave?: boolean;
    onAfterSave?: () => void;
    componentsProps?: EditDialogComponentsProps;
    options?: EditDialogOptions;
}

export function useEditDialog(): [React.ComponentType<EditDialogProps>, { id?: string; mode?: "add" | "edit" }, IEditDialogApi, ISelectionApi] {
    const [Selection, selection, selectionApi] = useSelectionRoute();
    const [options, setOptions] = React.useState<EditDialogOptions>({ readonly: false });

    const openAddDialog = React.useCallback(
        (id?: string) => {
            selectionApi.handleAdd(id);
        },
        [selectionApi],
    );

    const openEditDialog = React.useCallback(
        (id: string, options?: EditDialogOptions) => {
            selectionApi.handleSelectId(id);
            options && setOptions(options);
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
            setOptions({ readonly: false });
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
        return (props: EditDialogProps) => {
            return (
                <Selection>
                    <EditDialogFormApiProvider onAfterSave={props.onAfterSave}>
                        <EditDialogInner {...props} selection={selection} selectionApi={selectionApi} api={api} options={options} />
                    </EditDialogFormApiProvider>
                </Selection>
            );
        };
    }, [Selection, options, api, selection, selectionApi]);

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

const EditDialogInner: React.FunctionComponent<EditDialogProps & IHookProps> = ({
    selection,
    selectionApi,
    api,
    title: maybeTitle,
    disableCloseAfterSave = false,
    onAfterSave,
    children,
    componentsProps,
    options,
}) => {
    const intl = useIntl();
    const editDialogFormApi = useEditDialogFormApi();
    const parentRouterContext = React.useContext(RouterContext);
    const saveActionRef = React.useRef<SaveAction>();

    const title: string | ITitle = maybeTitle ?? {
        edit: intl.formatMessage(messages.edit),
        add: intl.formatMessage(messages.add),
    };

    const handleSaveClick = async () => {
        if (!saveActionRef.current) {
            console.error("Can't save, no RouterPrompt registered with saveAction");
            return;
        }
        const saveResult = await saveActionRef.current();

        if (saveResult) {
            setTimeout(() => {
                // TODO DirtyHandler removal: do we need a onReset functionality here?
                if (!disableCloseAfterSave) {
                    api.closeDialog({ delay: true });
                }
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
        <RouterContext.Provider
            value={{
                register: ({ saveAction, ...args }) => {
                    saveActionRef.current = saveAction;
                    parentRouterContext?.register({ saveAction, ...args });
                },
                unregister: (id) => {
                    saveActionRef.current = undefined;
                    parentRouterContext?.unregister(id);
                },
            }}
        >
            <EditDialogApiContext.Provider value={api}>
                <Dialog open={isOpen} onClose={handleCloseClick} {...componentsProps?.dialog}>
                    <div>
                        <DialogTitle {...componentsProps?.dialogTitle}>
                            {typeof title === "string" ? title : selection.mode === "edit" ? title.edit : title.add}
                        </DialogTitle>
                        <DialogContent {...componentsProps?.dialogContent}>{children}</DialogContent>
                        <DialogActions {...componentsProps?.dialogActions}>
                            <CancelButton onClick={handleCancelClick} />
                            <SaveButton
                                disabled={options?.readonly || false}
                                saving={editDialogFormApi?.saving}
                                hasErrors={editDialogFormApi?.hasErrors}
                                onClick={handleSaveClick}
                            >
                                <FormattedMessage {...messages.save} />
                            </SaveButton>
                        </DialogActions>
                    </div>
                </Dialog>
            </EditDialogApiContext.Provider>
        </RouterContext.Provider>
    );
};

interface IEditDialogHooklessProps extends EditDialogProps {
    children: (injectedProps: { selectedId?: string; selectionMode?: "add" | "edit" }) => React.ReactNode;
}

const EditDialogHooklessInner: React.ForwardRefRenderFunction<IEditDialogApi, IEditDialogHooklessProps> = (
    { children, title, onAfterSave, componentsProps },
    ref,
) => {
    const [EditDialogConfigured, selection, api] = useEditDialog();
    React.useImperativeHandle(ref, () => api);
    return (
        <EditDialogConfigured title={title} onAfterSave={onAfterSave} componentsProps={componentsProps}>
            {children({ selectedId: selection.id, selectionMode: selection.mode })}
        </EditDialogConfigured>
    );
};
export const EditDialog = React.forwardRef(EditDialogHooklessInner);

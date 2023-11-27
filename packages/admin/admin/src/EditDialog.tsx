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
import { useIntl } from "react-intl";

import { CancelButton } from "./common/buttons/cancel/CancelButton";
import { CloseDialogOptions, IEditDialogApi } from "./EditDialogApiContext";
import { messages } from "./messages";
import { SaveBoundary } from "./saveBoundary/SaveBoundary";
import { SaveBoundarySaveButton } from "./saveBoundary/SaveBoundarySaveButton";
import { ISelectionApi } from "./SelectionApi";
import { useSelectionRoute } from "./SelectionRoute";

interface ITitle {
    edit: React.ReactNode;
    add: React.ReactNode;
}

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

    const EditDialogWithHookProps = React.useMemo(() => {
        return (props: EditDialogProps) => {
            return (
                <Selection>
                    <EditDialogInner {...props} selection={selection} selectionApi={selectionApi} api={api} />
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

const EditDialogInner: React.FunctionComponent<EditDialogProps & IHookProps> = ({
    selection,
    selectionApi,
    api,
    title: maybeTitle,
    disableCloseAfterSave = false,
    onAfterSave,
    children,
    componentsProps,
}) => {
    const intl = useIntl();

    const title = maybeTitle ?? {
        edit: intl.formatMessage(messages.edit),
        add: intl.formatMessage(messages.add),
    };

    const handleCancelClick = () => {
        // TODO DirtyHandler removal: do we need a onReset functionality here?
        api.closeDialog();
    };

    const handleCloseClick = () => {
        api.closeDialog();
    };

    const handleAfterSave = React.useCallback(() => {
        setTimeout(() => {
            // TODO DirtyHandler removal: do we need a onReset functionality here?
            if (!disableCloseAfterSave) {
                api.closeDialog({ delay: true });
            }
            onAfterSave?.();
        });
    }, [api, disableCloseAfterSave, onAfterSave]);

    const isOpen = !!selection.mode;

    return (
        <SaveBoundary onAfterSave={handleAfterSave}>
            <Dialog open={isOpen} onClose={handleCloseClick} {...componentsProps?.dialog}>
                <div>
                    <DialogTitle {...componentsProps?.dialogTitle}>
                        {typeof title === "string" ? title : selection.mode === "edit" ? title.edit : title.add}
                    </DialogTitle>
                    <DialogContent {...componentsProps?.dialogContent}>{children}</DialogContent>
                    <DialogActions {...componentsProps?.dialogActions}>
                        <CancelButton onClick={handleCancelClick} />
                        <SaveBoundarySaveButton disabled={false} />
                    </DialogActions>
                </div>
            </Dialog>
        </SaveBoundary>
    );
};

interface IEditDialogHooklessProps extends EditDialogProps {
    children: (injectedProps: { selectedId?: string; selectionMode?: "edit" | "add" }) => React.ReactNode;
}

const EditDialogHooklessInner: React.RefForwardingComponent<IEditDialogApi, IEditDialogHooklessProps> = (
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

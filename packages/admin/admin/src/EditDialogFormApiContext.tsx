import * as React from "react";

type FormStatus = "saving" | "error";

export interface EditDialogFormApi {
    saving: boolean;
    hasErrors: boolean;
    onFormStatusChange: (status: FormStatus) => void;
    resetFormStatus: () => void;
    onAfterSave?: () => void;
}

export const EditDialogFormApiContext = React.createContext<EditDialogFormApi | null>(null);
export function useEditDialogFormApi() {
    return React.useContext(EditDialogFormApiContext);
}

type EditDialogFormApiProviderProps = {
    onAfterSave?: () => void;
};

export const EditDialogFormApiProvider: React.FunctionComponent<EditDialogFormApiProviderProps> = ({ children, onAfterSave }) => {
    const [status, setStatus] = React.useState<FormStatus | null>(null);

    const onFormStatusChange = React.useCallback((status: FormStatus) => {
        setStatus(status);
    }, []);

    const resetFormStatus = React.useCallback(() => {
        setStatus(null);
    }, []);

    const editDialogFormApi: EditDialogFormApi = React.useMemo(() => {
        return {
            saving: status === "saving",
            hasErrors: status === "error",
            onFormStatusChange,
            resetFormStatus,
            onAfterSave,
        };
    }, [onFormStatusChange, resetFormStatus, status, onAfterSave]);

    return <EditDialogFormApiContext.Provider value={editDialogFormApi}>{children}</EditDialogFormApiContext.Provider>;
};

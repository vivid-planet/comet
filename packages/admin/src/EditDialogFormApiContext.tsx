import * as React from "react";

type FormStatus = "saving" | "error";

export interface EditDialogFormApi {
    saving: boolean;
    hasErrors: boolean;
    onFormStatusChange: (status: FormStatus) => void;
    resetFormStatus: () => void;
}

export const EditDialogFormApiContext = React.createContext<EditDialogFormApi | null>(null);
export function useEditDialogFormApi() {
    return React.useContext(EditDialogFormApiContext);
}

export const EditDialogFormApiProvider: React.FunctionComponent = ({ children }) => {
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
        };
    }, [onFormStatusChange, resetFormStatus, status]);

    return <EditDialogFormApiContext.Provider value={editDialogFormApi}>{children}</EditDialogFormApiContext.Provider>;
};

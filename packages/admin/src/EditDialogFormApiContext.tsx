import * as React from "react";

export interface EditDialogFormApi {
    submitting: boolean;
    onSubmit: (submitting?: boolean) => void;
}

export const EditDialogFormApiContext = React.createContext<EditDialogFormApi | null>(null);
export function useEditDialogFormApi() {
    return React.useContext(EditDialogFormApiContext);
}

export const EditDialogFormApiProvider: React.FunctionComponent = ({ children }) => {
    const [submitting, setSubmitting] = React.useState<boolean>(false);

    const onSubmit = React.useCallback((submitting: boolean = true) => {
        setSubmitting(submitting);
    }, []);

    const editDialogFormApi: EditDialogFormApi = React.useMemo(() => {
        return {
            submitting,
            onSubmit,
        };
    }, [onSubmit, submitting]);

    return <EditDialogFormApiContext.Provider value={editDialogFormApi}>{children}</EditDialogFormApiContext.Provider>;
};

import * as React from "react";

export interface SnackbarApi {
    showSnackbar: (newSnackbar: React.ReactNode) => void;
}

const SnackbarContext = React.createContext<SnackbarApi | null>(null);

export const useSnackbarApi = () => {
    const context = React.useContext(SnackbarContext);

    if (context === null) {
        throw new Error("No snackbar context found. Please ensure that you have called `SnackbarProvider` higher up in your tree.");
    }

    return context;
};

export const SnackbarProvider: React.FunctionComponent = ({ children }) => {
    const [snackbar, setSnackbar] = React.useState<React.ReactNode>();

    const updateSnackbar = (newSnackbar: React.ReactNode) => {
        setSnackbar(newSnackbar);
    };

    const contextValue = React.useMemo(
        () => ({
            showSnackbar: updateSnackbar,
        }),
        [],
    );

    return (
        <SnackbarContext.Provider value={contextValue}>
            {children}
            {snackbar}
        </SnackbarContext.Provider>
    );
};

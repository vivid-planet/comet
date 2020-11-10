import * as React from "react";

export interface IAddDialogApi {
    open: () => void;
}

export interface IEditDialogApi {
    open: (id: string) => void;
}

export const AddDialogApiContext = React.createContext<IAddDialogApi | null>(null);
export function useAddDialogApi() {
    return React.useContext(AddDialogApiContext);
}

export const EditDialogApiContext = React.createContext<IEditDialogApi | null>(null);
export function useEditDialogApi() {
    return React.useContext(EditDialogApiContext);
}
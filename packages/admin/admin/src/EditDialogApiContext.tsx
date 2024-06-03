import * as React from "react";

export interface CloseDialogOptions {
    delay?: boolean | number;
}

export interface EditDialogOptions {
    readonly: boolean;
}

export interface IEditDialogApi {
    openAddDialog: (id?: string) => void;
    openEditDialog: (id: string, options?: EditDialogOptions) => void;
    closeDialog: (options?: CloseDialogOptions) => void;
}

export const EditDialogApiContext = React.createContext<IEditDialogApi | null>(null);
export function useEditDialogApi() {
    return React.useContext(EditDialogApiContext);
}

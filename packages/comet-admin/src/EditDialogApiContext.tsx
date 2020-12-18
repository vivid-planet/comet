import * as React from "react";

export interface IEditDialogApi {
    openAddDialog: (id?: string) => void;
    openEditDialog: (id: string) => void;
}

export const EditDialogApiContext = React.createContext<IEditDialogApi | null>(null);
export function useEditDialogApi() {
    return React.useContext(EditDialogApiContext);
}

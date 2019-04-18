import * as React from "react";

export interface IEditDialogApi {
    openAddDialog: () => void;
    openEditDialog: (id: string) => void;
}

export const EditDialogApiContext = React.createContext<IEditDialogApi | null>(null);

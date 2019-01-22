import * as React from "react";

export interface IEditDialogApi {
    openAddDialog: () => void;
    openEditDialog: (id: string) => void;
}

export default React.createContext<IEditDialogApi | null>(null);

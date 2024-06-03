import * as React from "react";

import { EditDialogProps } from "./EditDialog";

export interface CloseDialogOptions {
    delay?: boolean | number;
}

export interface EditDialogOptions {
    readonly: boolean;
}

export interface IEditDialogApi {
    openAddDialog: (id?: string) => void;
    openEditDialog: (id: string, options?: EditDialogProps) => void;
    closeDialog: (options?: CloseDialogOptions) => void;
    editDialogProps: React.PropsWithChildren<EditDialogProps>;
    setEditDialogProps: React.Dispatch<React.SetStateAction<React.PropsWithChildren<EditDialogProps>>>;
}

export const EditDialogApiContext = React.createContext<IEditDialogApi | null>(null);
export function useEditDialogApi() {
    return React.useContext(EditDialogApiContext);
}

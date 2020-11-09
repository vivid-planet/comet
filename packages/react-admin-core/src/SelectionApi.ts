export interface ISelectionApi {
    handleSelectId: (id: string) => void;
    handleDeselect: () => void;
    handleAdd: (id?: string) => void;
}

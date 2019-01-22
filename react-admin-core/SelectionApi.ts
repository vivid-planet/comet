export default interface ISelectionApi {
    handleSelectId: (id: string) => Promise<any>;
    handleDeselect: () => Promise<any>;
    selectIdWithoutDirtyCheck: (id: string) => void;
    deselectWithoutDirtyCheck: () => void;
    handleAdd: () => Promise<any>;
}

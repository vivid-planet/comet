export default interface ISelectionApi {
    handleSelectId: (id: string) => void;
    handleDeselect: () => void;
    handleAdd: () => void;
}

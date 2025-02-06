import { SaveButton, type SaveButtonProps } from "../common/buttons/save/SaveButton";
import { useSavable, useSaveBoundaryApi } from "./SaveBoundary";

export function SaveBoundarySaveButton(props: SaveButtonProps) {
    const saveBoundaryState = useSavable();
    const saveBoundaryApi = useSaveBoundaryApi();
    if (!saveBoundaryState || !saveBoundaryApi) throw new Error("SaveBoundarySaveButton must be inside SaveBoundary");
    return (
        <SaveButton
            disabled={!saveBoundaryState.hasChanges}
            saving={saveBoundaryState.saving}
            hasErrors={saveBoundaryState.hasErrors}
            onClick={async () => {
                return saveBoundaryApi.save();
            }}
            {...props}
        />
    );
}

import { SaveButton, type SaveButtonProps } from "../common/buttons/SaveButton";
import { useSavable, useSaveBoundaryApi } from "./SaveBoundary";

export function SaveBoundarySaveButton(props: SaveButtonProps) {
    const saveBoundaryState = useSavable();
    const saveBoundaryApi = useSaveBoundaryApi();
    if (!saveBoundaryState || !saveBoundaryApi) throw new Error("SaveBoundarySaveButton must be inside SaveBoundary");

    return (
        <SaveButton
            disabled={!saveBoundaryState.hasChanges}
            loading={saveBoundaryState.saving}
            hasErrors={saveBoundaryState.hasErrors}
            onClick={async () => {
                await saveBoundaryApi.save();
            }}
            {...props}
        />
    );
}

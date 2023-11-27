import * as React from "react";

import { SaveButton, SaveButtonProps } from "../common/buttons/save/SaveButton";
import { useSaveRangeApi, useSaveRangeState } from "./SaveRange";

export function SaveRangeSaveButton(props: SaveButtonProps) {
    const saveRangeState = useSaveRangeState();
    const saveRangeApi = useSaveRangeApi();
    if (!saveRangeState || !saveRangeApi) throw new Error("SaveButton must be inside SaveRange");
    return (
        <SaveButton
            disabled={!saveRangeState.hasChanges}
            saving={saveRangeState.saving}
            hasErrors={saveRangeState.hasErrors}
            onClick={async () => {
                return saveRangeApi.save();
            }}
            {...props}
        />
    );
}

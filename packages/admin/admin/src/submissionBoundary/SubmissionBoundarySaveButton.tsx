import * as React from "react";

import { SaveButton, SaveButtonProps } from "../common/buttons/save/SaveButton";
import { useSubmissionBoundaryApi, useSubmissionBoundaryState } from "./SubmissionBoundary";

export function SubmissionBoundarySaveButton(props: SaveButtonProps) {
    const submissionBoundaryState = useSubmissionBoundaryState();
    const submissionBoundaryApi = useSubmissionBoundaryApi();
    if (!submissionBoundaryState || !submissionBoundaryApi) throw new Error("SaveButton must be inside SubmissionBoundary");
    return (
        <SaveButton
            disabled={!submissionBoundaryState.hasChanges}
            saving={submissionBoundaryState.saving}
            hasErrors={submissionBoundaryState.hasErrors}
            onClick={async () => {
                return submissionBoundaryApi.save();
            }}
            {...props}
        />
    );
}

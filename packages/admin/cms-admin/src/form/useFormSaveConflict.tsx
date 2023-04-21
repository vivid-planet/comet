import { FormApi } from "final-form";
import React from "react";

import { useSaveConflict } from "../pages/useSaveConflict";

export interface FormSaveConflictOptions<FormValues, InitialFormValues> {
    checkConflict: () => Promise<boolean>;
    formApiRef: React.MutableRefObject<FormApi<FormValues, InitialFormValues> | undefined>;
    loadLatestVersion: () => Promise<void>;
}

export function useFormSaveConflict<FormValues, InitialFormValues>({
    checkConflict,
    formApiRef,
    loadLatestVersion,
}: FormSaveConflictOptions<FormValues, InitialFormValues>) {
    const ret = useSaveConflict({
        checkConflict,
        hasChanges: () => {
            return formApiRef.current?.getState().dirty ?? false;
        },
        onDiscardButtonPressed: async () => {
            await loadLatestVersion();
            formApiRef.current?.reset();
        },
        loadLatestVersion: async () => {
            await loadLatestVersion();
            formApiRef.current?.reset();
        },
    });
    return ret;
}

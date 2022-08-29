import { messages, SaveButton, SaveButtonProps, SplitButton, useStackApi } from "@comet/admin";
import React from "react";
import { FormattedMessage } from "react-intl";

interface SaveStateOptions<TData> {
    hasChanges: boolean;
    saveConflict: {
        hasConflict: boolean;
        loading: boolean;
        dialogs: React.ReactNode;
        checkForConflicts: () => Promise<boolean>;
    };
    mode: "edit" | "add";
    save: () => Promise<TData>;
    navigateToEditPage: (data: TData) => Promise<void>;
    validate: () => Promise<boolean>;
    updateReferenceContent: (data: TData) => void;
}
interface SaveStateReturn {
    handleSaveClick: () => Promise<void>;
    saving: boolean;
    saveError?: unknown;
    valid: boolean;
    validating: boolean;
    saveButton: JSX.Element;
}
export function useSaveState<TData>(options: SaveStateOptions<TData>): SaveStateReturn {
    const [saving, setSaving] = React.useState(false);
    const [saveError, setSaveError] = React.useState<unknown>();
    const [valid, setValid] = React.useState(true);
    const [validating, setValidating] = React.useState(false);

    const handleSaveClick = React.useCallback(
        async (canNavigate = false) => {
            setValidating(true);
            const isValid = await options.validate();
            setValid(isValid);
            setValidating(false);

            if (!isValid) {
                //onValidationFailed && onValidationFailed();
                return;
            }

            if (options.mode === "edit") {
                const hasSaveConflict = await options.saveConflict.checkForConflicts();
                if (hasSaveConflict) {
                    return; // dialogs open for the user to handle the conflict
                }
            }

            try {
                setSaving(true);
                const data = await options.save();
                options.updateReferenceContent(data);
                setTimeout(() => {
                    if (canNavigate) {
                        options.navigateToEditPage(data);
                    }
                }, 0);
            } catch (error) {
                setSaveError(error);
            } finally {
                setSaving(false);
            }
        },
        [options],
    );

    const saveButton = (
        <SaveStateSaveButton
            hasChanges={options.hasChanges}
            handleSaveClick={handleSaveClick}
            saveError={saveError}
            saving={saving}
            valid={valid}
            validating={validating}
            checkingSaveConflict={options.saveConflict.loading}
            hasConflict={options.saveConflict.hasConflict}
        />
    );

    return {
        handleSaveClick,
        saving,
        saveError,
        valid,
        validating,
        saveButton,
    };
}

interface SaveStateSaveButtonProps {
    handleSaveClick: (canNavigate?: boolean) => Promise<void>;
    hasChanges?: boolean;
    saving: boolean;
    saveError?: unknown;
    validating: boolean;
    valid: boolean;
    checkingSaveConflict: boolean;
    hasConflict: boolean;
}
export function SaveStateSaveButton({
    handleSaveClick,
    hasChanges,
    saving,
    saveError,
    validating,
    valid,
    checkingSaveConflict,
    hasConflict,
}: SaveStateSaveButtonProps): JSX.Element {
    const stackApi = useStackApi();

    const saveButtonProps: Omit<SaveButtonProps, "children" | "onClick"> = {
        color: "primary",
        variant: "contained",
        saving: saving || validating || checkingSaveConflict,
        hasErrors: !!saveError || !valid || hasConflict,
        errorItem: !valid ? (
            <FormattedMessage {...messages.invalidData} />
        ) : hasConflict ? (
            <FormattedMessage {...messages.saveConflict} />
        ) : undefined,
    };

    return (
        <SplitButton localStorageKey="SaveSplitButton" disabled={!hasChanges}>
            <SaveButton onClick={() => handleSaveClick(true)} {...saveButtonProps}>
                <FormattedMessage {...messages.save} />
            </SaveButton>
            <SaveButton
                onClick={async () => {
                    await handleSaveClick();
                    stackApi?.goBack();
                }}
                {...saveButtonProps}
            >
                <FormattedMessage {...messages.saveAndGoBack} />
            </SaveButton>
        </SplitButton>
    );
}

import * as React from "react";
import { useForm, useFormState } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { SaveButton } from "./common/buttons/save/SaveButton";
import { messages } from "./messages";

interface FinalFormSaveButtonProps {
    message?: React.ReactNode;
}

export const FinalFormSaveButton = ({ message = <FormattedMessage {...messages.save} /> }: FinalFormSaveButtonProps) => {
    const form = useForm();
    const { pristine, hasValidationErrors, submitting, hasSubmitErrors } = useFormState();

    const isDisabled = pristine || hasValidationErrors || submitting;

    return (
        <SaveButton
            disabled={isDisabled}
            color="primary"
            variant="contained"
            saving={submitting}
            hasErrors={hasSubmitErrors}
            onClick={() => {
                if (!isDisabled) form.submit();
            }}
        >
            {message}
        </SaveButton>
    );
};

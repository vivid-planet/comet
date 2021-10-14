import * as React from "react";
import { PropsWithChildren } from "react";
import { useForm, useFormState } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { SaveButton } from "./common/buttons/save/SaveButton";
import { SplitButton } from "./common/buttons/split/SplitButton";
import { useStackApi } from "./stack/Api";

export interface FormSaveButtonProps {
    localStorageKey?: string;
}

export const FinalFormSaveSplitButton = ({ localStorageKey }: PropsWithChildren<FormSaveButtonProps>) => {
    const stackApi = useStackApi();
    const form = useForm();
    const { pristine, hasValidationErrors, submitting, hasSubmitErrors } = useFormState();

    return (
        <SplitButton disabled={pristine || hasValidationErrors || submitting} localStorageKey={localStorageKey}>
            <SaveButton
                color={"primary"}
                variant={"contained"}
                saving={submitting}
                hasErrors={hasSubmitErrors}
                onClick={() => {
                    form.submit();
                }}
            >
                <FormattedMessage id="comet.generic.save" defaultMessage="Save" />
            </SaveButton>
            <SaveButton
                color={"primary"}
                variant={"contained"}
                saving={submitting}
                hasErrors={hasSubmitErrors}
                onClick={async () => {
                    const submitResult = await form.submit();
                    const error = submitResult !== undefined;
                    if (!error) {
                        stackApi?.goBack();
                    }
                }}
            >
                <FormattedMessage id="comet.generic.saveAndGoBack" defaultMessage="Save and go back" />
            </SaveButton>
        </SplitButton>
    );
};

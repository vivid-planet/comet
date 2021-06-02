import { FORM_ERROR } from "final-form";
import * as React from "react";
import { PropsWithChildren } from "react";
import { useForm, useFormState } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { SaveButton } from "./common/buttons/save/SaveButton";
import { SplitButton } from "./common/buttons/split/SplitButton";
import { useStackApi } from "./stack/Api";

export interface FormSaveButtonProps {
    localStorageKey?: string;
    saving: boolean;
    hasErrors: boolean;
}

export const FormSaveSplitButton = ({ saving, hasErrors, localStorageKey }: PropsWithChildren<FormSaveButtonProps>) => {
    const stackApi = useStackApi();
    const form = useForm();
    const { pristine, hasValidationErrors, submitting } = useFormState();

    return (
        <SplitButton disabled={pristine || hasValidationErrors || submitting} localStorageKey={localStorageKey}>
            <SaveButton
                color={"primary"}
                variant={"contained"}
                saving={saving}
                hasErrors={hasErrors}
                onClick={() => {
                    form.submit();
                }}
            >
                <FormattedMessage id="comet.generic.save" defaultMessage="Save" />
            </SaveButton>
            <SaveButton
                color={"primary"}
                variant={"contained"}
                saving={saving}
                hasErrors={hasErrors != null}
                onClick={async () => {
                    const submitResult = await form.submit();
                    const error = submitResult?.[FORM_ERROR];
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

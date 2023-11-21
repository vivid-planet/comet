import * as React from "react";
import { PropsWithChildren } from "react";
import { useForm, useFormState } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { SaveButton } from "./common/buttons/save/SaveButton";
import { SplitButton } from "./common/buttons/split/SplitButton";
import { FinalFormSubmitEvent } from "./FinalForm";
import { messages } from "./messages";
import { useStackApi } from "./stack/Api";

export interface FormSaveButtonProps {
    localStorageKey?: string;
}

export const FinalFormSaveSplitButton = ({ localStorageKey = "SaveSplitButton" }: PropsWithChildren<FormSaveButtonProps>) => {
    const stackApi = useStackApi();
    const form = useForm();
    const { pristine, hasValidationErrors, submitting, hasSubmitErrors } = useFormState();

    const setSubmitEvent = form.mutators.setSubmitEvent
        ? form.mutators.setSubmitEvent
        : () => {
              // eslint-disable-next-line no-console
              console.warn(`Can't set submitEvent, as the setSubmitEvent mutator is missing. Did you forget to add the mutator to the form?`);
          };

    return (
        <SplitButton disabled={pristine || hasValidationErrors || submitting} localStorageKey={localStorageKey}>
            <SaveButton
                color="primary"
                variant="contained"
                saving={submitting}
                hasErrors={hasSubmitErrors}
                onClick={async (clickEvent) => {
                    const event = new FinalFormSubmitEvent("submit");
                    event.navigatingBack = false;
                    setSubmitEvent(event);
                    await form.submit();
                    setSubmitEvent(undefined);
                }}
            >
                <FormattedMessage {...messages.save} />
            </SaveButton>
            <SaveButton
                color="primary"
                variant="contained"
                saving={submitting}
                hasErrors={hasSubmitErrors}
                onClick={async () => {
                    const event = new FinalFormSubmitEvent("submit");
                    event.navigatingBack = true;
                    setSubmitEvent(event);
                    const submitReturn = await form.submit();
                    setSubmitEvent(undefined);
                    const successful = submitReturn === undefined || Object.keys(submitReturn).length == 0;
                    if (successful) {
                        stackApi?.goBack();
                    }
                }}
            >
                <FormattedMessage {...messages.saveAndGoBack} />
            </SaveButton>
        </SplitButton>
    );
};

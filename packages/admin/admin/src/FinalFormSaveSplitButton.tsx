import { ChevronDown } from "@comet/admin-icons";
import { type PropsWithChildren } from "react";
import { useForm, useFormState } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { SaveButton } from "./common/buttons/save/SaveButton";
import { SplitButton, type SplitButtonProps } from "./common/buttons/split/SplitButton";
import { FinalFormSubmitEvent } from "./FinalForm";
import { messages } from "./messages";
import { useStackApi } from "./stack/Api";

interface FormSaveButtonProps {
    localStorageKey?: string;
    hasConflict?: boolean;
}

/**
 * @deprecated Use `FinalFormSaveButton` instead as we are retiring the SplitButton pattern.
 */
export const FinalFormSaveSplitButton = ({ localStorageKey = "SaveSplitButton", hasConflict = false }: PropsWithChildren<FormSaveButtonProps>) => {
    const stackApi = useStackApi();
    const form = useForm();
    const { pristine, hasValidationErrors, submitting, hasSubmitErrors } = useFormState();

    const setSubmitEvent = form.mutators.setSubmitEvent
        ? form.mutators.setSubmitEvent
        : () => {
              console.warn(`Can't set submitEvent, as the setSubmitEvent mutator is missing. Did you forget to add the mutator to the form?`);
          };

    const splitButtonProps: Partial<SplitButtonProps> = {};
    if (hasConflict) {
        splitButtonProps.selectIcon = (
            <ChevronDown
                sx={(theme) => ({
                    color: theme.palette.error.contrastText,
                })}
            />
        );
    }
    return (
        <SplitButton {...splitButtonProps} disabled={pristine || hasValidationErrors || submitting} localStorageKey={localStorageKey}>
            <SaveButton
                // setting the color to "error" is only necessary for the SplitButton and doesn't affect the SaveButton
                color={hasConflict ? "error" : "primary"}
                variant="contained"
                saving={submitting}
                hasErrors={hasSubmitErrors}
                hasConflict={hasConflict}
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

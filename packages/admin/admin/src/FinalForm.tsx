import { getApolloContext } from "@apollo/client";
import { Config, Decorator, FORM_ERROR, FormApi, FormSubscription, MutableState, Mutator, SubmissionErrors, ValidationErrors } from "final-form";
import setFieldData from "final-form-set-field-data";
import * as React from "react";
import { AnyObject, Form, FormRenderProps, RenderableProps } from "react-final-form";
import { useIntl } from "react-intl";

import { Loading } from "./common/Loading";
import { EditDialogApiContext } from "./EditDialogApiContext";
import { useEditDialogFormApi } from "./EditDialogFormApiContext";
import { renderComponent } from "./finalFormRenderComponent";
import { FinalFormContext, FinalFormContextProvider } from "./form/FinalFormContextProvider";
import { messages } from "./messages";
import { RouterPrompt } from "./router/Prompt";
import { useSubRoutePrefix } from "./router/SubRoute";
import { TableQueryContext } from "./table/TableQueryContext";

export const useFormApiRef = <FormValues = Record<string, any>, InitialFormValues = Partial<FormValues>>() =>
    React.useRef<FormApi<FormValues, InitialFormValues>>();

// copy of FormProps from final-form, because Omit doen't work on it
interface IProps<FormValues = Record<string, any>, InitialFormValues = Partial<FormValues>>
    extends Omit<Config<FormValues, InitialFormValues>, "onSubmit">,
        RenderableProps<FormRenderProps<FormValues, InitialFormValues>> {
    subscription?: FormSubscription;
    decorators?: Array<Decorator<FormValues, InitialFormValues>>;
    form?: FormApi<FormValues, InitialFormValues>;
    initialValuesEqual?: (a?: AnyObject, b?: AnyObject) => boolean;
    [otherProp: string]: any;

    mode: "edit" | "add";
    resolveSubmitErrors?: (error: SubmissionErrors) => SubmissionErrors;

    // override final-form onSubmit and remove callback as we don't support that (return promise instead)
    onSubmit: (
        values: FormValues,
        form: FormApi<FormValues>,
        event: FinalFormSubmitEvent,
    ) => SubmissionErrors | Promise<SubmissionErrors | undefined> | undefined | void;

    /**
     * This method will be called at the end of a submit process.
     */
    onAfterSubmit?: (values: FormValues, form: FormApi<FormValues>) => void;
    validateWarning?: (values: FormValues) => ValidationErrors | Promise<ValidationErrors> | undefined;
    formContext?: Partial<FinalFormContext>;
    apiRef?: React.MutableRefObject<FormApi<FormValues> | undefined>;
    subRoutePath?: string;
}

declare module "final-form" {
    interface InternalFormState {
        submitEvent: any;
    }
}

const setSubmitEvent: Mutator<any, any> = (args: any[], state: MutableState<any, any>) => {
    const [event] = args;
    state.formState.submitEvent = event;
};
const getSubmitEvent: Mutator<any, any> = (args: any[], state: MutableState<any, any>) => {
    return state.formState.submitEvent;
};

export class FinalFormSubmitEvent extends Event {
    navigatingBack?: boolean;
}

export function FinalForm<FormValues = AnyObject>(props: IProps<FormValues>) {
    const { client } = React.useContext(getApolloContext());
    const editDialog = React.useContext(EditDialogApiContext);
    const tableQuery = React.useContext(TableQueryContext);
    const editDialogFormApi = useEditDialogFormApi();

    const { onAfterSubmit, validateWarning } = props;

    return (
        <Form
            {...props}
            mutators={{
                ...props.mutators,
                setFieldData: setFieldData as unknown as Mutator<FormValues, object>,
                setSubmitEvent: setSubmitEvent as unknown as Mutator<FormValues, object>,
                getSubmitEvent: getSubmitEvent as unknown as Mutator<FormValues, object>,
            }}
            onSubmit={handleSubmit}
            render={RenderForm}
        />
    );

    function RenderForm({ formContext = {}, ...formRenderProps }: FormRenderProps<FormValues> & { formContext: Partial<FinalFormContext> }) {
        const intl = useIntl();
        const subRoutePrefix = useSubRoutePrefix();
        if (props.apiRef) props.apiRef.current = formRenderProps.form;
        const { mutators } = formRenderProps.form;
        const setFieldData = mutators.setFieldData as (...args: any[]) => any;
        const subRoutePath = props.subRoutePath ?? `${subRoutePrefix}/form`;

        const submit = React.useCallback(
            (event: any) => {
                event.preventDefault(); //  Prevents from reloading the page with GET-params on submit
                if (!formRenderProps.dirty) return;
                return new Promise<SubmissionErrors | void>((resolve) => {
                    Promise.resolve(formRenderProps.handleSubmit(event)).then(
                        () => {
                            if (formRenderProps.submitSucceeded) {
                                resolve();
                            } else {
                                resolve(formRenderProps.submitErrors);
                            }
                        },
                        (error) => {
                            resolve(error);
                        },
                    );
                });
            },
            [formRenderProps],
        );

        const currentWarningValidationRound = React.useRef(0);

        const registeredFields = formRenderProps.form.getRegisteredFields();

        React.useEffect(() => {
            if (validateWarning) {
                const validate = async () => {
                    currentWarningValidationRound.current++;
                    const validationRound = currentWarningValidationRound.current;

                    const validationWarnings = await Promise.resolve(validateWarning(formRenderProps.values));

                    if (currentWarningValidationRound.current > validationRound) {
                        // Another validation has been started, skip this one
                        return;
                    }

                    if (!validationWarnings) {
                        registeredFields.forEach((fieldName) => {
                            setFieldData(fieldName, { warning: undefined });
                        });
                        return;
                    }

                    Object.entries(validationWarnings).forEach(([fieldName, warning]) => {
                        setFieldData(fieldName, { warning });
                    });
                };

                validate();
            }
        }, [formRenderProps.values, setFieldData, registeredFields]);

        return (
            <FinalFormContextProvider {...formContext}>
                <RouterPrompt
                    message={() => {
                        if (formRenderProps.form.getState().dirty) {
                            return intl.formatMessage(messages.saveUnsavedChanges);
                        }
                        return true;
                    }}
                    saveAction={async () => {
                        editDialogFormApi?.onFormStatusChange("saving");
                        const hasValidationErrors = await waitForValidationToFinish(formRenderProps.form);

                        if (hasValidationErrors) {
                            editDialogFormApi?.onFormStatusChange("error");
                            return false;
                        }

                        const submissionErrors = await formRenderProps.form.submit();

                        if (submissionErrors) {
                            editDialogFormApi?.onFormStatusChange("error");
                            return false;
                        }

                        return true;
                    }}
                    // TODO DirtyHandler removal: do we need a resetAction functionality here?
                    subRoutePath={subRoutePath}
                >
                    <form onSubmit={submit}>
                        <div>
                            {renderComponent<FormValues>(
                                {
                                    children: props.children,
                                    component: props.component,
                                    render: props.render,
                                },
                                formRenderProps,
                            )}
                        </div>
                        {(formRenderProps.submitError || formRenderProps.error) && (
                            <div className="error">{formRenderProps.submitError || formRenderProps.error}</div>
                        )}
                        {!editDialog && <>{formRenderProps.submitting && <Loading behavior="fillParent" />}</>}
                    </form>
                </RouterPrompt>
            </FinalFormContextProvider>
        );
    }

    async function handleSubmit(values: FormValues, form: FormApi<FormValues>) {
        const submitEvent = (form.mutators.getSubmitEvent ? form.mutators.getSubmitEvent() : undefined) || new FinalFormSubmitEvent("submit");
        const ret = props.onSubmit(values, form, submitEvent);

        editDialogFormApi?.onFormStatusChange("saving");

        return Promise.resolve(ret)
            .then((data) => {
                // setTimeout is required because of https://github.com/final-form/final-form/pull/229
                setTimeout(() => {
                    if (props.mode === "add") {
                        if (tableQuery) {
                            // refetch TableQuery after adding
                            client?.query({
                                query: tableQuery.api.getQuery(),
                                variables: tableQuery.api.getVariables(),
                                fetchPolicy: "network-only",
                            });
                        }
                    }

                    onAfterSubmit?.(values, form);
                    editDialogFormApi?.onAfterSave?.();
                });
                return data;
            })
            .then(
                (data) => {
                    // for final-form undefined means success, an obj means error
                    editDialogFormApi?.resetFormStatus();

                    form.reset(values);
                    return undefined;
                },
                (error) => {
                    editDialogFormApi?.onFormStatusChange("error");

                    if (props.resolveSubmitErrors) {
                        return props.resolveSubmitErrors(error);
                    }
                    // resolve with FORM_ERROR
                    return Promise.resolve({
                        [FORM_ERROR]: error.toString(),
                    });
                },
            );
    }
}

const waitForValidationToFinish = (form: FormApi<any>): Promise<boolean> | boolean => {
    const formState = form.getState();
    if (!formState.validating) {
        return formState.hasValidationErrors;
    }

    return new Promise((resolve) => {
        const unsubscribe = form.subscribe(
            (state) => {
                if (!state.validating) {
                    unsubscribe();
                    resolve(state.hasValidationErrors);
                }
            },
            { validating: true, hasValidationErrors: true },
        );
    });
};

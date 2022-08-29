import { useApolloClient } from "@apollo/client";
import { CircularProgress } from "@mui/material";
import { FORM_ERROR, FormApi, Mutator, SubmissionErrors, ValidationErrors } from "final-form";
import setFieldData from "final-form-set-field-data";
import * as React from "react";
import { AnyObject, Form, FormProps, FormRenderProps } from "react-final-form";

import { DirtyHandlerApiContext } from "./DirtyHandlerApiContext";
import { EditDialogApiContext } from "./EditDialogApiContext";
import { useEditDialogFormApi } from "./EditDialogFormApiContext";
import { renderComponent } from "./finalFormRenderComponent";
import { FinalFormContext, FinalFormContextProvider } from "./form/FinalFormContextProvider";
import { SubmitError, SubmitResult } from "./form/SubmitResult";
import { StackApiContext } from "./stack/Api";
import { TableQueryContext } from "./table/TableQueryContext";

interface IProps<FormValues = AnyObject> extends FormProps<FormValues> {
    mode: "edit" | "add";
    resolveSubmitErrors?: (error: SubmissionErrors) => SubmissionErrors;

    // override final-form onSubmit and remove callback as we don't support that (return promise instead)
    onSubmit: (values: FormValues, form: FormApi<FormValues>) => SubmissionErrors | Promise<SubmissionErrors | undefined> | undefined | void;

    /* override onAfterSubmit. This method will be called at the end of a submit process.
     *
     * default implementation : go back if a stackApi context exists
     */
    onAfterSubmit?: (values: FormValues, form: FormApi<FormValues>) => void;
    validateWarning?: (values: FormValues) => ValidationErrors | Promise<ValidationErrors> | undefined;
    formContext?: Partial<FinalFormContext>;
}

export function FinalForm<FormValues = AnyObject>(props: IProps<FormValues>) {
    const client = useApolloClient();
    const dirtyHandler = React.useContext(DirtyHandlerApiContext);
    const stackApi = React.useContext(StackApiContext);
    const editDialog = React.useContext(EditDialogApiContext);
    const tableQuery = React.useContext(TableQueryContext);
    const editDialogFormApi = useEditDialogFormApi();

    const {
        onAfterSubmit = () => {
            stackApi?.goBack();
            editDialog?.closeDialog({ delay: true });
        },
        validateWarning,
    } = props;

    const ref = React.useRef();

    return (
        <Form
            {...props}
            mutators={{ ...props.mutators, setFieldData: setFieldData as unknown as Mutator<FormValues, object> }}
            onSubmit={handleSubmit}
            render={RenderForm}
        />
    );

    function RenderForm({ formContext = {}, ...formRenderProps }: FormRenderProps<FormValues> & { formContext: Partial<FinalFormContext> }) {
        const { mutators } = formRenderProps.form;
        const setFieldData = mutators.setFieldData as (...args: any[]) => any;

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

        React.useEffect(() => {
            if (dirtyHandler) {
                dirtyHandler.registerBinding(ref, {
                    isDirty: () => {
                        return formRenderProps.form.getState().dirty;
                    },
                    submit: async (): Promise<SubmitResult> => {
                        if (formRenderProps.hasValidationErrors) {
                            return {
                                error: new SubmitError("Form has Validation Errors", formRenderProps.errors),
                            };
                        }

                        const submissionErrors = await formRenderProps.form.submit();
                        if (submissionErrors) {
                            return {
                                error: new SubmitError("Form has Submission Errors", submissionErrors),
                            };
                        }

                        return {};
                    },
                    reset: () => {
                        formRenderProps.form.reset();
                    },
                });
            }
            return () => {
                if (dirtyHandler) {
                    dirtyHandler.unregisterBinding(ref);
                }
            };
        }, [formRenderProps, submit]);

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
                    {!editDialog && <>{formRenderProps.submitting && <CircularProgress />}</>}
                </form>
            </FinalFormContextProvider>
        );
    }

    function handleSubmit(values: FormValues, form: FormApi<FormValues>) {
        const ret = props.onSubmit(values, form);

        if (ret === undefined) return ret;

        editDialogFormApi?.onFormStatusChange("saving");
        return Promise.resolve(ret)
            .then((data) => {
                // setTimeout is required because of https://github.com/final-form/final-form/pull/229
                setTimeout(() => {
                    if (props.mode === "add") {
                        if (tableQuery) {
                            // refetch TableQuery after adding
                            client.query({
                                query: tableQuery.api.getQuery(),
                                variables: tableQuery.api.getVariables(),
                                fetchPolicy: "network-only",
                            });
                        }
                    }

                    onAfterSubmit(values, form);
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

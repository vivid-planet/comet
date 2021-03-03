import { useApolloClient } from "@apollo/client";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Cancel as CancelIcon, Save as SaveIcon } from "@material-ui/icons";
import { FORM_ERROR, FormApi, SubmissionErrors, ValidationErrors } from "final-form";
import * as React from "react";
import { AnyObject, Form, FormProps, FormRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { DirtyHandlerApiContext } from "./DirtyHandlerApiContext";
import { EditDialogApiContext } from "./EditDialogApiContext";
import { renderComponent } from "./finalFormRenderComponent";
import { SubmitError, SubmitResult } from "./form/SubmitResult";
import { StackApiContext } from "./stack";
import { TableQueryContext } from "./table";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        saveButton: {
            margin: theme.spacing(1),
        },
    }),
);

interface IProps<FormValues = AnyObject> extends FormProps<FormValues> {
    mode: "edit" | "add";
    resolveSubmitErrors?: (error: SubmissionErrors) => SubmissionErrors;
    components?: {
        buttonsContainer?: React.ComponentType;
    };
    renderButtons?: (formRenderProps: FormRenderProps<FormValues>) => React.ReactNode;

    // override final-form onSubmit and remove callback as we don't support that (return pomise instead)
    onSubmit: (values: FormValues, form: FormApi<FormValues>) => SubmissionErrors | Promise<SubmissionErrors | undefined> | undefined | void;
}

export function FinalForm<FormValues = AnyObject>(props: IProps<FormValues>) {
    const classes = useStyles();
    const client = useApolloClient();
    const dirtyHandler = React.useContext(DirtyHandlerApiContext);
    const stackApi = React.useContext(StackApiContext);
    const editDialog = React.useContext(EditDialogApiContext);
    const tableQuery = React.useContext(TableQueryContext);

    const ref = React.useRef();

    return <Form {...props} onSubmit={handleSubmit} render={RenderForm} />;

    function RenderForm(formRenderProps: FormRenderProps<FormValues>) {
        const submit = React.useCallback(
            (event: any) => {
                if (!formRenderProps.dirty) return;
                return new Promise((resolve) => {
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
                    submit: async (): Promise<SubmitResult<ValidationErrors | SubmissionErrors>> => {
                        if (formRenderProps.hasValidationErrors) {
                            return {
                                error: new SubmitError<ValidationErrors>({
                                    message: "Form has Validation Errors",
                                    submitError: formRenderProps.errors,
                                }),
                            };
                        }

                        const submissionErrors = await formRenderProps.form.submit();
                        if (submissionErrors) {
                            return {
                                error: new SubmitError<SubmissionErrors>({ message: "Form has Submission Errors", submitError: submissionErrors }),
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

        const ButtonsContainer = props.components && props.components.buttonsContainer ? props.components.buttonsContainer : "div";

        return (
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
                {formRenderProps.submitError && <div className="error">{formRenderProps.submitError}</div>}
                {!editDialog && (
                    <>
                        {formRenderProps.submitting && <CircularProgress />}
                        {!formRenderProps.submitting && (
                            <>
                                {props.renderButtons ? (
                                    props.renderButtons(formRenderProps)
                                ) : (
                                    <ButtonsContainer>
                                        {stackApi && (
                                            <Button
                                                className={classes.saveButton}
                                                startIcon={<CancelIcon />}
                                                variant="text"
                                                color="default"
                                                onClick={handleCancelClick}
                                            >
                                                <Typography variant="button">
                                                    <FormattedMessage id="cometAdmin.generic.cancel" defaultMessage="Cancel" />
                                                </Typography>
                                            </Button>
                                        )}
                                        <Button
                                            className={classes.saveButton}
                                            startIcon={<SaveIcon />}
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                            disabled={formRenderProps.pristine || formRenderProps.hasValidationErrors || formRenderProps.submitting}
                                        >
                                            <Typography variant="button">
                                                <FormattedMessage id="cometAdmin.generic.save" defaultMessage="Save" />
                                            </Typography>
                                        </Button>
                                    </ButtonsContainer>
                                )}
                            </>
                        )}
                    </>
                )}
            </form>
        );
    }

    function handleCancelClick() {
        if (stackApi) stackApi.goBack();
    }

    function handleSubmit(values: FormValues, form: FormApi<FormValues>) {
        const ret = props.onSubmit(values, form);

        if (ret === undefined) return ret;

        return Promise.resolve(ret)
            .then((data) => {
                // setTimeout is required because of https://github.com/final-form/final-form/pull/229
                setTimeout(() => {
                    if (props.mode === "add") {
                        form.reset(); // reset form to initial values so it is not dirty anymore (needed when adding)

                        if (tableQuery) {
                            // refetch TableQuery after adding
                            client.query({
                                query: tableQuery.api.getQuery(),
                                variables: tableQuery.api.getVariables(),
                                fetchPolicy: "network-only",
                            });
                        }
                    }

                    if (stackApi) {
                        // if this form is inside a Stack goBack after save success
                        // do this after form.reset() to have a clean form, so it won't ask for saving changes
                        // TODO we probably shouldn't have a hard dependency to Stack
                        stackApi.goBack();
                    }
                });
                return data;
            })
            .then(
                (data) => {
                    // for final-form undefined means success, an obj means error
                    return undefined;
                },
                (error) => {
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

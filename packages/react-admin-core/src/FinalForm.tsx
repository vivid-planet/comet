import { useApolloClient } from "@apollo/react-hooks";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Cancel as CancelIcon, Save as SaveIcon } from "@material-ui/icons";
import { FORM_ERROR, FormApi, SubmissionErrors } from "final-form";
import * as React from "react";
import { AnyObject, Form, FormProps, FormRenderProps } from "react-final-form";
import { DirtyHandlerApiContext } from "./DirtyHandlerApiContext";
import { EditDialogApiContext } from "./EditDialogApiContext";
import { renderComponent } from "./finalFormRenderComponent";
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
    components?: {
        buttonsContainer?: React.ComponentType;
    };
    renderButtons?: (formRenderProps: FormRenderProps<FormValues>) => React.ReactNode;
}

export function FinalForm<FormValues = AnyObject>(props: IProps<FormValues>) {
    const classes = useStyles();
    const client = useApolloClient();
    const dirtyHandler = React.useContext(DirtyHandlerApiContext);
    const stackApi = React.useContext(StackApiContext);
    const editDialog = React.useContext(EditDialogApiContext);
    const tableQuery = React.useContext(TableQueryContext);

    const ref = React.useRef();

    return <Form {...props} onSubmit={handleSubmit} render={renderForm} />;

    function renderForm(formRenderProps: FormRenderProps<FormValues>) {
        React.useEffect(() => {
            if (dirtyHandler) {
                dirtyHandler.registerBinding(ref, {
                    isDirty: () => {
                        return formRenderProps.form.getState().dirty;
                    },
                    submit: () => {
                        return submit(undefined);
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
        }, [dirtyHandler, formRenderProps]);

        function submit(event: any) {
            if (!formRenderProps.dirty) return;
            return new Promise(resolve => {
                Promise.resolve(formRenderProps.handleSubmit(event)).then(
                    () => {
                        if (formRenderProps.submitSucceeded) {
                            resolve();
                        } else {
                            resolve(formRenderProps.submitErrors);
                        }
                    },
                    error => {
                        resolve(error);
                    },
                );
            });
        }

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
                                                <Typography variant="button">Abbrechen</Typography>
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
                                            <Typography variant="button">Speichern</Typography>
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

    function handleSubmit(values: FormValues, form: FormApi<FormValues>, callback?: (errors?: SubmissionErrors) => void) {
        const ret = props.onSubmit(values, form, callback);
        if (ret === undefined) return ret;

        return Promise.resolve(ret)
            .then(data => {
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
                data => {
                    // for final-form undefined means success, an obj means error
                    return undefined;
                },
                error => {
                    // resolve with FORM_ERROR
                    return Promise.resolve({
                        [FORM_ERROR]: error.toString(),
                    });
                },
            );
    }
}

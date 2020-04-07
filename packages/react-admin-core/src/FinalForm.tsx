import { useApolloClient } from "@apollo/react-hooks";
import { CircularProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import { FORM_ERROR, FormApi, SubmissionErrors } from "final-form";
import * as React from "react";
import { AnyObject, Form, FormProps, FormRenderProps } from "react-final-form";
import { DirtyHandlerApiContext } from "./DirtyHandlerApiContext";
import { EditDialogApiContext } from "./EditDialogApiContext";
import * as sc from "./FinalForm.sc";
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
                        return formRenderProps.dirty;
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

        const ButtonsContainer = props.components && props.components.buttonsContainer ? props.components.buttonsContainer : sc.ButtonsContainer;

        return (
            <form onSubmit={submit}>
                <sc.InnerForm>
                    {renderComponent<FormValues>(
                        {
                            children: props.children,
                            component: props.component,
                            render: props.render,
                        },
                        formRenderProps,
                    )}
                </sc.InnerForm>
                {formRenderProps.submitError && <div className="error">{formRenderProps.submitError}</div>}
                {!editDialog && (
                    <>
                        {formRenderProps.submitting && <CircularProgress />}
                        {!formRenderProps.submitting && (
                            <>
                                <ButtonsContainer>
                                    {stackApi && (
                                        <Button className={classes.saveButton} variant="text" color="default" onClick={handleCancelClick}>
                                            <sc.ButtonIconWrapper>
                                                <CancelIcon fontSize={"inherit"} />
                                            </sc.ButtonIconWrapper>
                                            Abbrechen
                                        </Button>
                                    )}
                                    <Button
                                        className={classes.saveButton}
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={formRenderProps.pristine || formRenderProps.hasValidationErrors || formRenderProps.submitting}
                                    >
                                        <sc.ButtonIconWrapper>
                                            <SaveIcon fontSize={"inherit"} />
                                        </sc.ButtonIconWrapper>
                                        Speichern
                                    </Button>
                                </ButtonsContainer>
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

                    // We call setTimeout here to allow React to render the form once more before navigating back.
                    // This ensures that a submitted form isn't dirty anymore upon navigating.
                    setTimeout(() => {
                        if (stackApi) {
                            // if this form is inside a Stack goBack after save success
                            // do this after form.reset() to have a dirty form, so it won't ask for saving changes
                            // TODO we probably shouldn't have a hard dependency to Stack
                            stackApi.goBack();
                        }
                    });
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

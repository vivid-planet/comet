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
}

export function FinalForm<FormValues = AnyObject>(props: IProps<FormValues>) {
    const classes = useStyles();
    const client = useApolloClient();
    const dirtyHandler = React.useContext(DirtyHandlerApiContext);
    const stackApi = React.useContext(StackApiContext);
    const editDialog = React.useContext(EditDialogApiContext);
    const tableQuery = React.useContext(TableQueryContext);
    let formRenderProps: FormRenderProps<FormValues> | undefined;

    const ref = React.useRef();
    React.useEffect(() => {
        if (dirtyHandler) {
            dirtyHandler.registerBinding(ref, {
                isDirty: () => {
                    if (!formRenderProps) return false;
                    return formRenderProps.dirty;
                },
                submit: () => {
                    return submit(undefined);
                },
                reset: () => {
                    if (!formRenderProps) return;
                    formRenderProps.form.reset();
                },
            });
        }
        return () => {
            if (dirtyHandler) {
                dirtyHandler.unregisterBinding(ref);
            }
        };
    }, [dirtyHandler]);

    return <Form onSubmit={handleSubmit} initialValues={props.initialValues} render={renderForm} />;

    function renderForm(frmRP: FormRenderProps<FormValues>) {
        formRenderProps = frmRP;
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

    function submit(event: any) {
        if (!formRenderProps) return;
        if (!formRenderProps.dirty) return;
        return new Promise((resolve, reject) => {
            if (!formRenderProps) return;
            return Promise.resolve(formRenderProps.handleSubmit(event)).then(
                data => {
                    if (!formRenderProps) return;
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

    function handleSubmit(values: FormValues, form: FormApi<FormValues>, callback?: (errors?: SubmissionErrors) => void) {
        let ret = props.onSubmit(values, form, callback);
        if (ret === undefined) return ret;
        ret = Promise.resolve(ret).then(data => {
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
            return data;
        });

        return Promise.resolve(ret)
            .then(data => {
                // setTimeout is required because of https://github.com/final-form/final-form/pull/229
                setTimeout(() => {
                    if (formRenderProps) {
                        formRenderProps.form.reset(); // reset form to initial values so it is not dirty anymore (needed when adding)
                    }
                    if (stackApi) {
                        // if this form is inside a Stack goBack after save success
                        // do this after form.reset() to have a dirty form, so it won't ask for saving changes
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

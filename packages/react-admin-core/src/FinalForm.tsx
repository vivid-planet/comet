import { CircularProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import ApolloClient from "apollo-client";
import { FORM_ERROR } from "final-form";
import * as React from "react";
import { ApolloConsumer } from "react-apollo";
import { Form, FormRenderProps } from "react-final-form";
import { EditDialogApiContext } from "./EditDialogApiContext";
import * as sc from "./FinalForm.sc";
import { CorrectFormRenderProps, renderComponent } from "./finalFormRenderComponent";
import { IStackApi, StackApiContext } from "./stack";
import { IWithDirtyHandlerApiProps, withDirtyHandlerApi } from "./table/withDirtyHandlerApi";
import { IWithTableQueryProps, withTableQueryContext } from "./table/withTableQueryContext";

const styles = (theme: Theme) =>
    createStyles({
        saveButton: {
            margin: theme.spacing(1),
        },
    });

interface IProps extends IWithDirtyHandlerApiProps, IWithTableQueryProps {
    mode: "edit" | "add";
    doUpdate?: (variables: object) => any; // TODO return type Promise?
    doCreate?: (variables: object) => any; // TODO return type Promise?
    onSubmit?: (values: object) => any; // TODO return type Promise?
    submitVariables?: object;
    classes: {
        saveButton: string;
    };
    initialValues?: any;
    modifySubmitVariables?: <T = object>(variables: T, mode: "edit" | "add") => T;
}

class FinalForm extends React.Component<IProps> {
    private client: ApolloClient<any>;
    private formRenderProps: FormRenderProps;
    public componentDidMount() {
        if (this.props.dirtyHandlerApi) {
            this.props.dirtyHandlerApi.registerBinding(this, {
                isDirty: () => {
                    if (!this.formRenderProps) return false;
                    return this.formRenderProps.dirty;
                },
                submit: () => {
                    return this.submit(undefined);
                },
                reset: () => {
                    if (!this.formRenderProps) return;
                    this.formRenderProps.form.reset();
                },
            });
        }
    }

    public componentWillUnmount() {
        if (this.props.dirtyHandlerApi) {
            this.props.dirtyHandlerApi.unregisterBinding(this);
        }
    }

    public render() {
        return (
            <ApolloConsumer>
                {client => {
                    this.client = client; // TODO port this component to hooks to avoid that
                    return (
                        <StackApiContext.Consumer>
                            {stackApi => (
                                <Form
                                    onSubmit={this.handleSubmit.bind(this, stackApi)}
                                    initialValues={this.props.initialValues}
                                    render={this.renderForm}
                                />
                            )}
                        </StackApiContext.Consumer>
                    );
                }}
            </ApolloConsumer>
        );
    }

    private renderForm = (formRenderProps: CorrectFormRenderProps) => {
        this.formRenderProps = formRenderProps;
        const { classes } = this.props;
        return (
            <form onSubmit={this.submit}>
                <sc.InnerForm>{renderComponent(formRenderProps)}</sc.InnerForm>
                {formRenderProps.submitError && <div className="error">{formRenderProps.submitError}</div>}
                <EditDialogApiContext.Consumer>
                    {editDialogApi => {
                        if (editDialogApi) return; // when inside EditDialog we don't need a save button

                        if (formRenderProps.submitting) return <CircularProgress />;

                        return (
                            <>
                                <StackApiContext.Consumer>
                                    {stackApi => {
                                        if (!stackApi) return null;

                                        return (
                                            <Button
                                                className={classes.saveButton}
                                                variant="text"
                                                color="default"
                                                onClick={this.handleCancelClick.bind(this, stackApi)}
                                            >
                                                <sc.ButtonIconWrapper>
                                                    <CancelIcon fontSize={"inherit"} />
                                                </sc.ButtonIconWrapper>
                                                Abbrechen
                                            </Button>
                                        );
                                    }}
                                </StackApiContext.Consumer>
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
                        );
                    }}
                </EditDialogApiContext.Consumer>
            </form>
        );
    };

    private handleCancelClick = (stackApi: IStackApi) => {
        stackApi.goBack();
    };

    private submit = (event: any) => {
        if (!this.formRenderProps) return;
        if (!this.formRenderProps.dirty) return;
        return new Promise((resolve, reject) => {
            return Promise.resolve(this.formRenderProps.handleSubmit(event)).then(
                data => {
                    if (this.formRenderProps.submitSucceeded) {
                        resolve();
                    } else {
                        resolve(this.formRenderProps.submitErrors);
                    }
                },
                error => {
                    resolve(error);
                },
            );
        });
    };

    private handleSubmit = (stackApi: IStackApi | undefined, values: object) => {
        let ret;
        if (this.props.onSubmit) {
            ret = this.props.onSubmit(values);
            ret = Promise.resolve(ret).then(data => {
                if (this.props.mode === "add") {
                    if (this.props.tableQuery) {
                        // refetch TableQuery after adding
                        this.client.query({
                            query: this.props.tableQuery.api.getQuery(),
                            variables: this.props.tableQuery.api.getVariables(),
                            fetchPolicy: "network-only",
                        });
                    }
                }
                return data;
            });
        } else {
            const submitVariables = this.props.submitVariables || {};
            if (this.props.mode === "edit") {
                if (!this.props.doUpdate) throw new Error("doUpdate is required with mode=edit");
                let variables = { ...submitVariables, id: this.props.initialValues.id, body: { ...values } };
                if (this.props.modifySubmitVariables) {
                    variables = this.props.modifySubmitVariables(variables, this.props.mode);
                }
                ret = this.props.doUpdate({
                    variables,
                });
            } else if (this.props.mode === "add") {
                if (!this.props.doCreate) throw new Error("doCreate is required with mode=add");
                const refetchQueries = [];
                if (this.props.tableQuery) {
                    refetchQueries.push({
                        query: this.props.tableQuery.api.getQuery(),
                        variables: this.props.tableQuery.api.getVariables(),
                    });
                }
                let variables = { ...submitVariables, body: { ...values } };
                if (this.props.modifySubmitVariables) {
                    variables = this.props.modifySubmitVariables(variables, this.props.mode);
                }
                ret = this.props.doCreate({
                    variables,
                    refetchQueries,
                    update: ({}, data: any) => {
                        if (this.props.tableQuery) {
                            this.props.tableQuery.api.onRowCreated(data.data.create.id);
                        }
                    },
                });
            } else {
                throw new Error("mode prop is required");
            }
        }
        return Promise.resolve(ret)
            .then(data => {
                // setTimeout is required because of https://github.com/final-form/final-form/pull/229
                setTimeout(() => {
                    this.formRenderProps.form.reset(); // reset form to initial values so it is not dirty anymore (needed when adding)
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
    };
}

const WrappedFinalForm = withStyles(styles)(withDirtyHandlerApi(withTableQueryContext(FinalForm)));
export { WrappedFinalForm as FinalForm };

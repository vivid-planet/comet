import { CircularProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Save from "@material-ui/icons/Save";
import { FORM_ERROR } from "final-form";
import * as React from "react";
import { Form, FormRenderProps } from "react-final-form";
import { compose } from "recompose";
import EditDialogApiContext from "./EditDialogApiContext";
import IStackApi, { StackApiContext } from "./Stack/Api";
import withDirtyHandlerApi, { IWithDirtyHandlerApiProps } from "./withDirtyHandlerApi";
import withTableQueryContext, { IWithTableQueryProps } from "./withTableQueryContext";

const styles = (theme: Theme) =>
    createStyles({
        saveButton: {
            margin: theme.spacing.unit,
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
}

class FinalForm extends React.Component<IProps> {
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
            <StackApiContext.Consumer>
                {stackApi => (
                    <Form onSubmit={this.handleSubmit.bind(this, stackApi)} initialValues={this.props.initialValues} render={this.renderForm} />
                )}
            </StackApiContext.Consumer>
        );
    }

    private renderForm = (formRenderProps: FormRenderProps) => {
        this.formRenderProps = formRenderProps;
        const { classes } = this.props;
        return (
            <form onSubmit={this.submit}>
                <div>{this.props.children}</div>
                {formRenderProps.submitError && <div className="error">{formRenderProps.submitError}</div>}
                <EditDialogApiContext.Consumer>
                    {editDialogApi => {
                        if (editDialogApi) return; // when inside EditDialog we don't need a save button

                        if (formRenderProps.submitting) return <CircularProgress />;

                        return (
                            <Button
                                className={classes.saveButton}
                                variant="raised"
                                color="primary"
                                type="submit"
                                disabled={formRenderProps.pristine || formRenderProps.hasValidationErrors || formRenderProps.submitting}
                            >
                                <Save />
                                Save
                            </Button>
                        );
                    }}
                </EditDialogApiContext.Consumer>
            </form>
        );
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
        } else {
            const submitVariables = this.props.submitVariables || {};
            if (this.props.mode === "edit") {
                if (!this.props.doUpdate) throw new Error("doUpdate is required with mode=edit");
                ret = this.props.doUpdate({
                    variables: { ...submitVariables, id: this.props.initialValues.id, body: values },
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
                ret = this.props.doCreate({
                    variables: { ...submitVariables, body: values },
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
                if (stackApi) {
                    // if this form is inside a Stack goBack after save success
                    // TODO we probably shouldn't have a hard dependency to Stack
                    stackApi.goBackForce();
                }
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

// export default compose(
//    withTableQueryContext,
//    withDirtyHandlerApi,
//    withStyles(styles),
// )(FinalForm);
export default withStyles(styles)(withDirtyHandlerApi(withTableQueryContext(FinalForm)));

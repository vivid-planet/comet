import { Grid, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CancelIcon from "@material-ui/icons/Cancel";
import { debounce } from "debounce";
import isEqual = require("lodash.isequal");
import * as React from "react";
import { AnyObject, Form, FormProps, FormSpy, FormSpyRenderProps } from "react-final-form";
import { CorrectFormRenderProps, renderComponent } from "../finalFormRenderComponent";
import * as sc from "./TableFilterFinalForm.sc";
import { IWithTableQueryProps, withTableQueryContext } from "./withTableQueryContext";

interface IAutoSaveProps extends IWithTableQueryProps, FormSpyRenderProps {
    values: any;
    modifySubmitVariables?: <T = object>(variables: T) => T;
}
interface IAutoSaveState {
    values: any;
}
class AutoSave extends React.Component<IAutoSaveProps, IAutoSaveState> {
    private valueChanged = debounce(() => {
        let { values } = this.props;
        if (!isEqual(this.state.values, values)) {
            this.setState({ values });
            if (this.props.tableQuery) {
                if (this.props.modifySubmitVariables) {
                    values = this.props.modifySubmitVariables({ ...values });
                }
                this.props.tableQuery.api.changeFilters(values);
            }
        }
    }, 500);

    constructor(props: IAutoSaveProps) {
        super(props);
        this.state = { values: props.values };
    }

    public componentDidUpdate() {
        this.valueChanged();
    }

    public render() {
        return <div />;
    }
}

const ExtendedAutoSave = withTableQueryContext(AutoSave);

type Props<FormValues> = Omit<FormProps<FormValues>, "onSubmit"> & {
    modifySubmitVariables?: (variables: any) => any;
    headline?: string;
    resetButton?: boolean;
    onSubmit?: FormProps<FormValues>["onSubmit"];
};

// tslint:disable-next-line:max-classes-per-file
export class TableFilterFinalForm<FormValues = AnyObject> extends React.Component<Props<FormValues>> {
    public render() {
        // remove render, children and component from forwardProps as we define render and those would interfere
        const { modifySubmitVariables, headline, resetButton, render, children, component, ...forwardProps } = this.props;
        return (
            <Form
                onSubmit={
                    this.props.onSubmit
                        ? this.props.onSubmit
                        : () => {
                              return;
                          }
                }
                render={this.renderForm}
                {...forwardProps}
            />
        );
    }
    private renderForm = (formRenderProps: CorrectFormRenderProps<FormValues>) => {
        // remove render as this is defined by us and should not be contained in childFormRenderProps
        const { render: ownRender, ...finalFormChildrenRenderProps } = formRenderProps;
        const { render, children, component } = this.props;
        // add render, children and component from own-props to childFormRenderProps as they are used to render the children
        const completeFinalFormChildRenderProps = {
            ...finalFormChildrenRenderProps,
            render,
            children,
            component,
        };
        return (
            <form>
                {(this.props.headline || this.props.resetButton) && (
                    <sc.FormHeader>
                        <Grid container justify="space-between">
                            {this.props.headline && (
                                <Grid item>
                                    <Typography variant="h4" color="primary">
                                        {this.props.headline}
                                    </Typography>
                                </Grid>
                            )}
                            {this.props.resetButton && (
                                <Grid item>
                                    <Button
                                        variant="text"
                                        color="default"
                                        onClick={() => {
                                            formRenderProps.form.reset();
                                        }}
                                    >
                                        <sc.FilterCancelIconWrapper>
                                            <CancelIcon fontSize={"small"} />
                                        </sc.FilterCancelIconWrapper>
                                        Filter zurücksetzen
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
                    </sc.FormHeader>
                )}
                {renderComponent<FormValues>(completeFinalFormChildRenderProps)}
                <FormSpy subscription={{ values: true }}>
                    {renderProps => <ExtendedAutoSave {...renderProps} modifySubmitVariables={this.props.modifySubmitVariables} />}
                </FormSpy>
            </form>
        );
    };
}

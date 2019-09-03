import { Grid, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CancelIcon from "@material-ui/icons/Cancel";
import { debounce } from "debounce";
import { AnyObject } from "final-form";
import isEqual = require("lodash.isequal");
import * as React from "react";
import { Form, FormProps, FormSpy, FormSpyRenderProps } from "react-final-form";
import { CorrectFormRenderProps, renderComponent } from "../finalFormRenderComponent";
import * as sc from "./TableFilterFinalForm.sc";
import { IFilterApi } from "./useTableQueryFilter";

interface IAutoSaveProps<FilterValues> extends FormSpyRenderProps {
    values: any;
    filterApi: IFilterApi<FilterValues>;
}
interface IAutoSaveState {
    values: any;
}
class AutoSave<FilterValues> extends React.Component<IAutoSaveProps<FilterValues>, IAutoSaveState> {
    private valueChanged = debounce(() => {
        const { values } = this.props;
        if (!isEqual(this.state.values, values)) {
            this.setState({ values });
            this.props.filterApi.changeFilters(values);
        }
    }, 500);

    constructor(props: IAutoSaveProps<FilterValues>) {
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

type Props<FilterValues = AnyObject> = Omit<FormProps<FilterValues>, "onSubmit"> & {
    headline?: string;
    resetButton?: boolean;
    onSubmit?: FormProps<FilterValues>["onSubmit"];
    filterApi: IFilterApi<FilterValues>;
};

// tslint:disable-next-line:max-classes-per-file
export class TableFilterFinalForm<FilterValues = AnyObject> extends React.Component<Props<FilterValues>> {
    public render() {
        // remove render, children and component from forwardProps as we define render and those would interfere
        const { headline, resetButton, render, children, component, ...forwardProps } = this.props;
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
    private renderForm = (formRenderProps: CorrectFormRenderProps<FilterValues>) => {
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
                {renderComponent<FilterValues>(completeFinalFormChildRenderProps)}
                <FormSpy subscription={{ values: true }}>{renderProps => <AutoSave {...renderProps} filterApi={this.props.filterApi} />}</FormSpy>
            </form>
        );
    };
}

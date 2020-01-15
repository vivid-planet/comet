import { Grid, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CancelIcon from "@material-ui/icons/Cancel";
import { debounce } from "debounce";
import { AnyObject } from "final-form";
import isEqual = require("lodash.isequal");
import * as React from "react";
import { Form, FormProps, FormRenderProps, FormSpy, FormSpyRenderProps } from "react-final-form";
import { renderComponent } from "../finalFormRenderComponent";
import * as sc from "./TableFilterFinalForm.sc";
import { IFilterApi } from "./useTableQueryFilter";

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
        const { headline, resetButton, render, children, component, onSubmit, ...forwardProps } = this.props;
        return (
            <Form
                onSubmit={
                    onSubmit
                        ? onSubmit
                        : () => {
                              return;
                          }
                }
                form={this.props.filterApi.formApi}
                render={this.renderForm}
                {...forwardProps}
            />
        );
    }
    private renderForm = (formRenderProps: FormRenderProps<FilterValues>) => {
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
                {renderComponent(this.props, formRenderProps)}
            </form>
        );
    };
}

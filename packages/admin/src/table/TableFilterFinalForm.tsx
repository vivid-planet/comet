import CancelIcon from "@mui/icons-material/Cancel";
import { Button, Grid, Typography } from "@mui/material";
import { AnyObject } from "final-form";
import * as React from "react";
import { Form, FormProps, FormRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { renderComponent } from "../finalFormRenderComponent";
import { IFilterApi } from "./useTableQueryFilter";

type Props<FilterValues = AnyObject> = Omit<FormProps<FilterValues>, "onSubmit" | "initialValues"> & {
    headline?: React.ReactNode;
    resetButton?: boolean;
    onSubmit?: FormProps<FilterValues>["onSubmit"];
    filterApi: IFilterApi<FilterValues>;
};

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
            <form onSubmit={formRenderProps.handleSubmit}>
                <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                    {(this.props.headline || this.props.resetButton) && (
                        <Grid item xs={12}>
                            <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                                {this.props.headline && (
                                    <Grid item>
                                        <Typography variant="h4">{this.props.headline}</Typography>
                                    </Grid>
                                )}
                                {this.props.resetButton && (
                                    <Grid item>
                                        <Button
                                            variant="text"
                                            startIcon={<CancelIcon />}
                                            onClick={() => {
                                                formRenderProps.form.reset();
                                            }}
                                        >
                                            <FormattedMessage id="cometAdmin.table.tableFilterFinalForm.resetButton" defaultMessage="Reset filter" />
                                        </Button>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        {renderComponent(this.props, formRenderProps)}
                    </Grid>
                </Grid>
            </form>
        );
    };
}

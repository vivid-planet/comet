import { Grid, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CancelIcon from "@material-ui/icons/Cancel";
import { debounce } from "debounce";
import { AnyObject } from "final-form";
import isEqual = require("lodash.isequal");
import * as React from "react";
import { Form, FormRenderProps, FormSpy, FormSpyRenderProps } from "react-final-form";
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

interface IProps<FilterValues = AnyObject> {
    headline?: string;
    resetButton?: boolean;
    filterApi: IFilterApi<FilterValues>;
}
// tslint:disable-next-line:max-classes-per-file
export class TableFilterFinalForm<FilterValues = AnyObject> extends React.Component<IProps<FilterValues>> {
    public render() {
        return <Form onSubmit={this.handleSubmit} render={this.renderForm} />;
    }
    private renderForm = (formRenderProps: FormRenderProps) => {
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
                {this.props.children}
                <FormSpy subscription={{ values: true }}>{renderProps => <AutoSave {...renderProps} filterApi={this.props.filterApi} />}</FormSpy>
            </form>
        );
    };
    private handleSubmit = () => {
        return;
    };
}

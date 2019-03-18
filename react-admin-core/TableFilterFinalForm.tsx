import { Grid, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CancelIcon from "@material-ui/icons/Cancel";
import { debounce } from "debounce";
import isEqual = require("lodash.isequal");
import * as React from "react";
import { Form, FormRenderProps, FormSpy, FormSpyRenderProps } from "react-final-form";
import withTableQueryContext, { IWithTableQueryProps } from "./withTableQueryContext";

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

interface IProps {
    modifySubmitVariables?: (variables: any) => any;
    headline?: string;
    resetButton?: boolean;
}
// tslint:disable-next-line:max-classes-per-file
class TableFilterFinalForm extends React.Component<IProps> {
    public render() {
        return <Form onSubmit={this.handleSubmit} render={this.renderForm} />;
    }
    private renderForm = (formRenderProps: FormRenderProps) => {
        return (
            <form>
                {(this.props.headline || this.props.resetButton) && (
                    <Grid container justify="space-between">
                        {this.props.headline && (
                            <Grid item>
                                <Typography variant="h5">{this.props.headline}</Typography>
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
                                    <CancelIcon />
                                    Filter zurücksetzen
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                )}

                {this.props.children}
                <FormSpy subscription={{ values: true }}>
                    {renderProps => <ExtendedAutoSave {...renderProps} modifySubmitVariables={this.props.modifySubmitVariables} />}
                </FormSpy>
            </form>
        );
    };
    private handleSubmit = () => {
        return;
    };
}

export default TableFilterFinalForm;

import { debounce } from "debounce";
import isEqual = require("lodash.isequal");
import * as React from "react";
import { Form, FormRenderProps, FormSpy, FormSpyRenderProps } from "react-final-form";
import withTableQueryContext, { IWithTableQueryProps } from "./withTableQueryContext";

interface IAutoSaveProps extends IWithTableQueryProps, FormSpyRenderProps {
    values: any;
}
interface IAutoSaveState {
    values: any;
}
class AutoSave extends React.Component<IAutoSaveProps, IAutoSaveState> {
    private valueChanged = debounce(() => {
        const { values } = this.props;
        if (!isEqual(this.state.values, values)) {
            this.setState({ values });
            if (this.props.tableQuery) {
                this.props.tableQuery.api.changeFilters(this.props.values);
            }
        }
    }, 500);

    constructor(props: IAutoSaveProps) {
        super(props);
        this.state = { values: props.values };
    }

    public componentWillReceiveProps() {
        this.valueChanged();
    }

    public render() {
        return <div />;
    }
}

const ExtendedAutoSave = withTableQueryContext(AutoSave);

// tslint:disable-next-line:max-classes-per-file
class TableFilterFinalForm extends React.Component {
    public render() {
        return <Form onSubmit={this.handleSubmit} render={this.renderForm} />;
    }
    private renderForm = (formRenderProps: FormRenderProps) => {
        return (
            <form>
                {this.props.children}
                <FormSpy subscription={{ values: true }} component={ExtendedAutoSave} />
            </form>
        );
    };
    private handleSubmit = () => {
        return;
    };
}

export default TableFilterFinalForm;

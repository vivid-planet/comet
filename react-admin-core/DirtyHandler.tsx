import * as History from "history";
import * as React from "react";
import DirtyHandlerApiContext, { IDirtyHandlerApi, IDirtyHandlerApiBinding } from "./DirtyHandlerApiContext";
import Prompt from "./router/Prompt";

interface IProps {}

interface IBinding {
    obj: React.Component;
    binding: IDirtyHandlerApiBinding;
}
type Bindings = IBinding[];
class DirtyHandler extends React.Component<IProps> {
    public static contextType = DirtyHandlerApiContext;

    public dirtyHandlerApi: IDirtyHandlerApi;
    private bindings: Bindings;

    constructor(props: IProps) {
        super(props);

        this.bindings = [];

        this.dirtyHandlerApi = {
            registerBinding: this.registerBinding.bind(this),
            unregisterBinding: this.unregisterBinding.bind(this),
            isBindingDirty: this.isBindingDirty.bind(this),
            resetBindings: this.resetBindings.bind(this),
            submitBindings: this.submitBindings.bind(this),
            getParent: this.getParent.bind(this),
        };
    }

    public componentDidMount() {
        if (this.context) {
            this.context.registerBinding(this, {
                isDirty: () => {
                    return this.isBindingDirty();
                },
                submit: () => {
                    return this.submitBindings();
                },
                reset: () => {
                    return this.resetBindings();
                },
            });
        }
    }

    public componentWillUnmount() {
        if (this.context) {
            this.context.unregisterBinding(this);
        }
    }

    public render() {
        return (
            <DirtyHandlerApiContext.Provider value={this.dirtyHandlerApi}>
                <Prompt message={this.promptMessage} />
                {this.props.children}
            </DirtyHandlerApiContext.Provider>
        );
    }

    private promptMessage = (): string | boolean => {
        if (!this.isBindingDirty()) {
            return true;
        } else {
            return "Lose unsaved changes?";
        }
    };

    private isBindingDirty() {
        return this.bindings
            .map(binding => {
                return binding.binding.isDirty();
            })
            .reduce((accumulator, currentValue) => accumulator || currentValue, false);
    }

    private submitBindings() {
        return Promise.all(
            this.bindings.map(binding => {
                return binding.binding.submit();
            }),
        );
    }

    private resetBindings() {
        return Promise.all(
            this.bindings.map(binding => {
                return binding.binding.reset();
            }),
        );
    }

    private registerBinding(obj: React.Component, binding: IDirtyHandlerApiBinding) {
        this.bindings.push({ obj, binding });
    }
    private unregisterBinding(obj: React.Component) {
        this.bindings = this.bindings.filter(item => item.obj !== obj);
    }

    private getParent(): IDirtyHandlerApi | undefined {
        return this.context;
    }
}

export default DirtyHandler;

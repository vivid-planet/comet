import * as React from "react";
import { useIntl, WrappedComponentProps } from "react-intl";

import { DirtyHandlerApiContext, IDirtyHandlerApi, IDirtyHandlerApiBinding } from "./DirtyHandlerApiContext";
import { SubmitResult } from "./form/SubmitResult";
import { messages } from "./messages";
import { RouterPrompt } from "./router/Prompt";

interface IProps {
    children?: React.ReactNode;
}

interface IBinding {
    obj: object;
    binding: IDirtyHandlerApiBinding;
}
type Bindings = IBinding[];

class DirtyHandlerComponent extends React.Component<IProps & WrappedComponentProps> {
    public static contextType = DirtyHandlerApiContext;

    public dirtyHandlerApi: IDirtyHandlerApi;
    private bindings: Bindings;

    constructor(props: IProps & WrappedComponentProps) {
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
                <RouterPrompt message={this.promptMessage} saveAction={this.saveAction} />
                {this.props.children}
            </DirtyHandlerApiContext.Provider>
        );
    }

    private saveAction = async (): Promise<boolean> => {
        const submitResults: Array<SubmitResult> = await this.submitBindings();
        return submitResults.every((submitResult) => !submitResult.error);
    };

    private promptMessage = (): string | boolean => {
        if (!this.isBindingDirty()) {
            return true;
        } else {
            return this.props.intl.formatMessage(messages.saveUnsavedChanges);
        }
    };

    private isBindingDirty() {
        return this.bindings
            .map((binding) => {
                return binding.binding.isDirty();
            })
            .reduce((accumulator, currentValue) => accumulator || currentValue, false);
    }

    private submitBindings() {
        return Promise.all(
            this.bindings.map(async (binding) => {
                let submitResult = await binding.binding.submit();

                if (submitResult === undefined) {
                    submitResult = {};
                }

                return submitResult;
            }),
        );
    }

    private resetBindings() {
        return Promise.all(
            this.bindings.map((binding) => {
                return binding.binding.reset();
            }),
        );
    }

    private registerBinding(obj: object, binding: IDirtyHandlerApiBinding) {
        this.bindings.push({ obj, binding });
    }
    private unregisterBinding(obj: object) {
        this.bindings = this.bindings.filter((item) => item.obj !== obj);
    }

    private getParent(): IDirtyHandlerApi | undefined {
        return this.context;
    }
}

export const DirtyHandler = React.forwardRef<DirtyHandlerComponent, IProps>((props, ref) => {
    const intl = useIntl();
    return <DirtyHandlerComponent ref={ref} intl={intl} {...props} />;
});

import { Location } from "history";
import * as React from "react";
import { defineMessages, useIntl, WrappedComponentProps } from "react-intl";

import { DirtyHandlerApiContext, IDirtyHandlerApi, IDirtyHandlerApiBinding } from "./DirtyHandlerApiContext";
import { SubmitResult } from "./form/SubmitResult";
import { PromptAction } from "./router/ConfirmationDialog";
import { RouterPrompt } from "./router/Prompt";
import { AllowTransition } from "./router/PromptHandler";

interface IProps {
    children?: React.ReactNode;
}

interface IBinding {
    obj: object;
    binding: IDirtyHandlerApiBinding;
}
type Bindings = IBinding[];

const messages = defineMessages({
    saveChanges: {
        id: "cometAdmin.dirtyHandler.saveChanges",
        defaultMessage: "Do you want to save the changes?",
        description: "Prompt to save unsaved changes",
    },
});
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
                <RouterPrompt message={this.promptMessage} handlePromptAction={this.handlePromptAction} />
                {this.props.children}
            </DirtyHandlerApiContext.Provider>
        );
    }

    private handlePromptAction = async (action: PromptAction): Promise<AllowTransition> => {
        if (action === PromptAction.Discard) {
            return true;
        } else if (action === PromptAction.Save) {
            const submitResults: Array<SubmitResult> = await this.submitBindings();
            return submitResults.every((submitResult) => !submitResult.error);
        }
        return false;
    };

    private promptMessage = (location?: Location): string | boolean => {
        if (!this.isBindingDirty(location?.state)) {
            return true;
        } else {
            return this.props.intl.formatMessage(messages.saveChanges);
        }
    };

    private isBindingDirty(state?: unknown) {
        return this.bindings
            .map((binding) => {
                return binding.binding.isDirty(state);
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

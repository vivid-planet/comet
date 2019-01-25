import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import * as React from "react";
import DirtyHandlerApiContext, { IDirtyHandlerApi, IDirtyHandlerApiBinding } from "./DirtyHandlerApiContext";

interface IProps {}
interface IState {
    dialogOpen: boolean;
}
interface IBinding {
    obj: React.Component;
    binding: IDirtyHandlerApiBinding;
}
type Bindings = IBinding[];
class DirtyHandler extends React.Component<IProps, IState> {
    public static contextType = DirtyHandlerApiContext;

    public dirtyHandlerApi: IDirtyHandlerApi;
    private bindings: Bindings;
    private resolveOnDialogClose: Array<() => void>;
    private rejectOnDialogClose: Array<(errors: any) => void>;

    constructor(props: IProps) {
        super(props);

        this.state = {
            dialogOpen: false,
        };
        this.bindings = [];

        this.dirtyHandlerApi = {
            registerBinding: this.registerBinding.bind(this),
            unregisterBinding: this.unregisterBinding.bind(this),
            isBindingDirty: this.isBindingDirty.bind(this),
            resetBindings: this.resetBindings.bind(this),
            submitBindings: this.submitBindings.bind(this),
            askSave: this.askSave.bind(this),
            askSaveIfDirty: this.askSaveIfDirty.bind(this),
            getParent: this.getParent.bind(this),
        };
        this.resolveOnDialogClose = [];
        this.rejectOnDialogClose = [];
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
                <React.Fragment>
                    {this.props.children}
                    <Dialog open={this.state.dialogOpen} onClose={this.handleDialogCloseNo}>
                        <DialogTitle>Save changes?</DialogTitle>
                        <DialogContent>
                            <DialogContentText>Save changes?</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleDialogCloseNo} color="primary">
                                No
                            </Button>
                            <Button onClick={this.handleDialogCloseYes} color="primary" autoFocus={true}>
                                Yes
                            </Button>
                        </DialogActions>
                    </Dialog>
                </React.Fragment>
            </DirtyHandlerApiContext.Provider>
        );
    }

    private handleDialogCloseYes = () => {
        this.setState({ dialogOpen: false });
        this.submitBindings().then(
            () => {
                this.resolveOnDialogClose.forEach(resolve => resolve());
                this.resolveOnDialogClose.length = 0;
                this.rejectOnDialogClose.length = 0;
            },
            errors => {
                this.rejectOnDialogClose.forEach(reject => reject(errors));
                this.resolveOnDialogClose.length = 0;
                this.rejectOnDialogClose.length = 0;
            },
        );
    };
    private handleDialogCloseNo = () => {
        this.setState({ dialogOpen: false });
        this.resetBindings().then(() => {
            this.resolveOnDialogClose.forEach(resolve => resolve());
            this.resolveOnDialogClose.length = 0;
            this.rejectOnDialogClose.length = 0;
        });
    };

    private isBindingDirty() {
        return Promise.all(
            this.bindings.map(binding => {
                return binding.binding.isDirty();
            }),
        ).then(data => data.reduce((accumulator, currentValue) => accumulator || currentValue, false));
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

    private askSave() {
        return new Promise((resolve, reject) => {
            this.setState({ dialogOpen: true });
            this.resolveOnDialogClose.push(resolve);
            this.rejectOnDialogClose.push(reject);
        });
    }

    private async askSaveIfDirty() {
        const isDirty = await this.isBindingDirty();
        if (isDirty) {
            return this.askSave();
        } else {
            return true;
        }
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

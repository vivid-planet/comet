import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import * as React from "react";
import DirtyHandler from "./DirtyHandler";
import DirtyHandlerApiContext from "./DirtyHandlerApiContext";
import EditDialogContext, { IEditDialogApi } from "./EditDialogApiContext";
import SelectionRoute from "./SelectionRoute";

interface IProps {
    children: (injectedProps: { selectedId?: string; selectionMode?: "edit" | "add" }) => React.ReactNode;
}
class EditDialog extends React.Component<IProps> {
    private editDialogApi: IEditDialogApi;
    private selectionRef: React.RefObject<SelectionRoute> = React.createRef<SelectionRoute>();

    constructor(props: IProps) {
        super(props);

        this.editDialogApi = {
            openAddDialog: this.openAddDialog.bind(this),
            openEditDialog: this.openEditDialog.bind(this),
        };
    }

    public render() {
        return (
            <EditDialogContext.Provider value={this.editDialogApi}>
                <DirtyHandler>
                    <SelectionRoute ref={this.selectionRef}>
                        {({ selectedId, selectionMode, selectionApi }) => (
                            <Dialog
                                open={!!selectionMode}
                                onClose={ev => {
                                    selectionApi.handleDeselect();
                                }}
                            >
                                <div>
                                    <DialogTitle>{selectionMode === "edit" ? "Edit" : "Add"}</DialogTitle>
                                    <DialogContent>{this.props.children({ selectedId, selectionMode })}</DialogContent>
                                    <DialogActions>
                                        <Button
                                            onClick={ev => {
                                                selectionApi.handleDeselect();
                                            }}
                                            color="primary"
                                        >
                                            Cancel
                                        </Button>
                                        <DirtyHandlerApiContext.Consumer>
                                            {dirtyHandlerApi => (
                                                <Button
                                                    onClick={ev => {
                                                        if (dirtyHandlerApi) {
                                                            dirtyHandlerApi.submitBindings().then(() => {
                                                                selectionApi.deselectWithoutDirtyCheck();
                                                            });
                                                        }
                                                    }}
                                                    color="primary"
                                                >
                                                    Save
                                                </Button>
                                            )}
                                        </DirtyHandlerApiContext.Consumer>
                                    </DialogActions>
                                </div>
                            </Dialog>
                        )}
                    </SelectionRoute>
                </DirtyHandler>
            </EditDialogContext.Provider>
        );
    }

    public openAddDialog() {
        if (this.selectionRef.current) this.selectionRef.current.selectionApi.handleAdd();
    }

    public openEditDialog(id: string) {
        if (this.selectionRef.current) this.selectionRef.current.selectionApi.handleSelectId(id);
    }
}

export default EditDialog;

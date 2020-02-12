import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import * as React from "react";
import { DirtyHandler } from "./DirtyHandler";
import { DirtyHandlerApiContext, IDirtyHandlerApi } from "./DirtyHandlerApiContext";
import { EditDialogApiContext, IEditDialogApi } from "./EditDialogApiContext";
import { ISelectionApi } from "./SelectionApi";
import { SelectionRoute } from "./SelectionRoute";

interface ITitle {
    edit: string;
    add: string;
}

interface IProps {
    title: ITitle | string;
    children: (injectedProps: { selectedId?: string; selectionMode?: "edit" | "add" }) => React.ReactNode;
}
export class EditDialog extends React.Component<IProps> {
    public static defaultProps = {
        title: {
            edit: "Bearbeiten",
            add: "Hinzufügen",
        },
    };

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
        const { children, title } = this.props;

        return (
            <EditDialogApiContext.Provider value={this.editDialogApi}>
                <DirtyHandler>
                    <SelectionRoute ref={this.selectionRef}>
                        {({ selectedId, selectionMode, selectionApi }) => (
                            <Dialog open={!!selectionMode} onClose={this.handleCancelClick.bind(this, selectionApi)}>
                                <div>
                                    <DialogTitle>{typeof title === "string" ? title : selectionMode === "edit" ? title.edit : title.add}</DialogTitle>
                                    <DialogContent>{children({ selectedId, selectionMode })}</DialogContent>
                                    <DialogActions>
                                        <Button onClick={this.handleCancelClick.bind(this, selectionApi)} color="primary">
                                            Abbrechen
                                        </Button>
                                        <DirtyHandlerApiContext.Consumer>
                                            {dirtyHandlerApi => (
                                                <Button onClick={this.handleSaveClick.bind(this, dirtyHandlerApi, selectionApi)} color="primary">
                                                    Speichern
                                                </Button>
                                            )}
                                        </DirtyHandlerApiContext.Consumer>
                                    </DialogActions>
                                </div>
                            </Dialog>
                        )}
                    </SelectionRoute>
                </DirtyHandler>
            </EditDialogApiContext.Provider>
        );
    }

    public openAddDialog() {
        if (this.selectionRef.current) this.selectionRef.current.selectionApi.handleAdd();
    }

    public openEditDialog(id: string) {
        if (this.selectionRef.current) this.selectionRef.current.selectionApi.handleSelectId(id);
    }
    private handleSaveClick = (dirtyHandlerApi: IDirtyHandlerApi | undefined, selectionApi: ISelectionApi) => {
        if (dirtyHandlerApi) {
            dirtyHandlerApi.submitBindings().then(() => {
                selectionApi.handleDeselect();
            });
        }
    };
    private handleCancelClick = (selectionApi: ISelectionApi) => {
        selectionApi.handleDeselect();
    };
}

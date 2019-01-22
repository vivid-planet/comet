import * as React from "react";
import DirtyHandlerApiContext, { IDirtyHandlerApi } from "./DirtyHandlerApiContext";
import ISelectionApi from "./SelectionApi";

export interface IRenderPropArgs {
    selectedId?: string;
    selectionMode?: "edit" | "add";
    selectionApi: ISelectionApi;
}
interface IProps {
    children: (injectedProps: IRenderPropArgs) => React.ReactNode;
}
interface IState {
    selectedId?: string;
    selectionMode?: "edit" | "add";
}
class Selection extends React.Component<IProps, IState> {
    private selectionApi: ISelectionApi;
    private dirtyHandlerApi?: IDirtyHandlerApi;
    constructor(props: IProps) {
        super(props);

        this.state = {
            selectedId: undefined,
            selectionMode: undefined,
        };

        this.selectionApi = {
            handleSelectId: this.handleSelectId.bind(this),
            handleDeselect: this.handleDeselect.bind(this),
            selectIdWithoutDirtyCheck: this.selectIdWithoutDirtyCheck.bind(this),
            deselectWithoutDirtyCheck: this.deselectWithoutDirtyCheck.bind(this),
            handleAdd: this.handleAdd.bind(this),
        };
    }

    public async handleSelectId(id: string) {
        if (this.dirtyHandlerApi) {
            try {
                await this.dirtyHandlerApi.askSaveIfDirty();
            } catch (e) {
                // saving changes failed, stop selecting id
                // TODO should this really catch the error silently?
                return;
            }
        }
        this.selectIdWithoutDirtyCheck(id);
    }

    public async handleDeselect() {
        if (this.dirtyHandlerApi) {
            try {
                await this.dirtyHandlerApi.askSaveIfDirty();
            } catch (e) {
                // saving changes failed, stop selecting id
                // TODO should this really catch the error silently?
                return;
            }
        }
        this.deselectWithoutDirtyCheck();
    }

    public selectIdWithoutDirtyCheck(id: string) {
        this.setState({ selectedId: id, selectionMode: "edit" });
    }
    public deselectWithoutDirtyCheck() {
        this.setState({ selectedId: undefined, selectionMode: undefined });
    }

    public async handleAdd() {
        if (this.dirtyHandlerApi) {
            try {
                await this.dirtyHandlerApi.askSaveIfDirty();
            } catch (e) {
                // saving changes failed, stop selecting id
                // TODO should this really catch the error silently?
                return;
            }
        }
        this.setState({ selectedId: undefined, selectionMode: "add" });
    }

    public render() {
        return (
            <DirtyHandlerApiContext.Consumer>
                {dirtyHandlerApi => {
                    // don't use withDirtyHandlerApi HOC to avoid ref issues
                    this.dirtyHandlerApi = dirtyHandlerApi;
                    return this.props.children({
                        selectedId: this.state.selectedId,
                        selectionMode: this.state.selectionMode,
                        selectionApi: this.selectionApi,
                    });
                }}
            </DirtyHandlerApiContext.Consumer>
        );
    }
}

export default Selection;

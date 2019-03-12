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
            handleAdd: this.handleAdd.bind(this),
        };
    }

    public handleSelectId(id: string) {
        this.setState({ selectedId: id, selectionMode: "edit" });
    }

    public handleDeselect() {
        this.setState({ selectedId: undefined, selectionMode: undefined });
    }

    public handleAdd() {
        this.setState({ selectedId: undefined, selectionMode: "add" });
    }

    public render() {
        return this.props.children({
            selectedId: this.state.selectedId,
            selectionMode: this.state.selectionMode,
            selectionApi: this.selectionApi,
        });
    }
}

export default Selection;

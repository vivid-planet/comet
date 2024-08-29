import { Component, createContext } from "react";

import { StackApiContext } from "./Api";

interface IProps {
    id: string;
    activePage: string;
    isInitialPageActive: boolean;
}

const SwitchMetaContext = createContext<string>("");

export class StackSwitchMeta extends Component<IProps> {
    public static contextType = StackApiContext;
    private parentId?: string;

    public render() {
        return (
            <SwitchMetaContext.Consumer>
                {(parentId) => {
                    this.parentId = parentId;
                    return <SwitchMetaContext.Provider value={this.props.id}>{this.props.children}</SwitchMetaContext.Provider>;
                }}
            </SwitchMetaContext.Consumer>
        );
    }

    public componentDidMount() {
        if (!this.context) throw new Error("Switch must be wrapped by a Stack");
        this.context.addSwitchMeta(this.props.id, {
            parentId: this.parentId,
            activePage: this.props.activePage,
            isInitialPageActive: this.props.isInitialPageActive,
        });
    }

    public componentDidUpdate(prevProps: IProps) {
        if (!this.context) throw new Error("Switch must be wrapped by a Stack");
        if (this.props.activePage !== prevProps.activePage || this.props.isInitialPageActive !== prevProps.isInitialPageActive) {
            this.context.addSwitchMeta(this.props.id, {
                parentId: this.parentId,
                activePage: this.props.activePage,
                isInitialPageActive: this.props.isInitialPageActive,
            });
        }
    }

    public componentWillUnmount() {
        if (!this.context) throw new Error("Switch must be wrapped by a Stack");
        this.context.removeSwitchMeta(this.props.id);
    }
}

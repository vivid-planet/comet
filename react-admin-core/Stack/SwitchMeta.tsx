import * as React from "react";
import { StackApiContext } from "./Api";

interface IProps {
    id: string;
    activePage: string;
    isInitialPageActive: boolean;
}

class SwitchMeta extends React.Component<IProps> {
    public static contextType = StackApiContext;

    public render() {
        return this.props.children;
    }

    public componentDidMount() {
        if (!this.context) throw new Error("Switch must be wrapped by a Stack");
        this.context.addSwitchMeta(this.props.id, { activePage: this.props.activePage, isInitialPageActive: this.props.isInitialPageActive });
    }

    public componentDidUpdate(prevProps: IProps) {
        if (!this.context) throw new Error("Switch must be wrapped by a Stack");
        if (this.props.activePage !== prevProps.activePage || this.props.isInitialPageActive !== prevProps.isInitialPageActive) {
            this.context.addSwitchMeta(this.props.id, { activePage: this.props.activePage, isInitialPageActive: this.props.isInitialPageActive });
        }
    }

    public componentWillUnmount() {
        if (!this.context) throw new Error("Switch must be wrapped by a Stack");
        this.context.removeSwitchMeta(this.props.id);
    }
}

export default SwitchMeta;

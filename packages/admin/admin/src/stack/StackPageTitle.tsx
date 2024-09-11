import { Component, ReactNode } from "react";

import { StackSwitchApiContext } from "./Switch";

interface IProps {
    title?: ReactNode;
}

export class StackPageTitle extends Component<IProps> {
    public static contextType = StackSwitchApiContext;
    public render() {
        return this.props.children;
    }

    public componentDidMount() {
        this.context.updatePageBreadcrumbTitle(this.props.title);
    }

    public componentDidUpdate(prevProps: IProps) {
        if (this.props.title !== prevProps.title) {
            this.context.updatePageBreadcrumbTitle(this.props.title);
        }
    }
}

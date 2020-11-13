import * as React from "react";

import { StackSwitchApiContext } from "./Switch";

interface IProps {
    title?: string;
    children: React.ReactNode;
}

export class StackPageTitle extends React.Component<IProps> {
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

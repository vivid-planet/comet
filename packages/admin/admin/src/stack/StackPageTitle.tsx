import * as React from "react";

import { StackSwitchApiContext } from "./Switch";

interface IProps {
    title?: React.ReactNode;
    children: React.ReactNode;
}

export class StackPageTitle extends React.Component<IProps> {
    public static contextType = StackSwitchApiContext;
    public render(): React.ReactNode {
        return this.props.children;
    }

    public componentDidMount(): void {
        this.context.updatePageBreadcrumbTitle(this.props.title);
    }

    public componentDidUpdate(prevProps: IProps): void {
        if (this.props.title !== prevProps.title) {
            this.context.updatePageBreadcrumbTitle(this.props.title);
        }
    }
}

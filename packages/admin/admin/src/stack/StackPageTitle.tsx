import { Component, type ContextType, type PropsWithChildren, type ReactNode } from "react";

import { StackSwitchApiContext } from "./Switch";

type IProps = PropsWithChildren<{
    title?: ReactNode;
}>;

export class StackPageTitle extends Component<IProps> {
    public static contextType = StackSwitchApiContext;
    declare context: ContextType<typeof StackSwitchApiContext>;

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

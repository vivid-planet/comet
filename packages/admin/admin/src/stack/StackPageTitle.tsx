import { Component, type ContextType, isValidElement, type PropsWithChildren, type ReactNode } from "react";

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
        const prevTitle = prevProps.title;
        const currTitle = this.props.title;

        if (isValidElement(prevTitle) && isValidElement(currTitle) && prevTitle.key === currTitle.key) {
            return;
        }

        if (prevTitle !== currTitle) {
            this.context.updatePageBreadcrumbTitle(currTitle);
        }
    }
}

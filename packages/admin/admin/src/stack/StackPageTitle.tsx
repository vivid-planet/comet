import { Component, ComponentType } from "react";
import { FormattedMessage } from "react-intl";

import { StackSwitchApiContext } from "./Switch";

interface IProps {
    title?: string | ComponentType<typeof FormattedMessage>;
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

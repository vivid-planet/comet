import { Component, ComponentType, ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export interface IStackPageProps {
    name: string;
    title?: string | ComponentType<typeof FormattedMessage>;
    children: ((id: string) => ReactNode) | ReactNode;
}

export class StackPage extends Component<IStackPageProps> {
    public render(): ReactNode {
        return null;
    }
}

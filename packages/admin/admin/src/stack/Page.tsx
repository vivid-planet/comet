import { Component, type ReactNode } from "react";

export interface IStackPageProps {
    name: string;
    title?: ReactNode;
    children: ((id: string) => ReactNode) | ReactNode;
}

export class StackPage extends Component<IStackPageProps> {
    public render(): ReactNode {
        return null;
    }
}

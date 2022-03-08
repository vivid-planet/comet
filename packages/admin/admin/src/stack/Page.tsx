import * as React from "react";

export interface IStackPageProps {
    name: string;
    title?: React.ReactNode;
    children: ((id: string) => React.ReactNode) | React.ReactNode;
}

export class StackPage extends React.Component<IStackPageProps> {
    public render(): React.ReactNode {
        return null;
    }
}

import * as React from "react";

export interface IProps {
    name: string;
    title?: string;
    children: ((id: string) => React.ReactNode) | React.ReactNode;
}

export default class StackPage extends React.Component<IProps> {
    public render(): React.ReactNode {
        return null;
    }
}

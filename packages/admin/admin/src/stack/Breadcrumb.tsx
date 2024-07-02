import * as React from "react";
import { v4 as uuid } from "uuid";

import { StackApiContext } from "./Api";

interface IProps {
    url: string;
    title: React.ReactNode;
    ignoreParentId?: boolean;
}

const BreadcrumbContext = React.createContext<string>("");

export class StackBreadcrumb extends React.Component<IProps> {
    public static contextType = StackApiContext;
    public id: string;
    private parentId?: string;
    constructor(props: IProps) {
        super(props);
        this.id = uuid();
    }
    public render() {
        return (
            <BreadcrumbContext.Consumer>
                {(parentId) => {
                    this.parentId = !this.props.ignoreParentId ? parentId : "";
                    return <BreadcrumbContext.Provider value={this.id}>{this.props.children}</BreadcrumbContext.Provider>;
                }}
            </BreadcrumbContext.Consumer>
        );
    }

    public componentDidMount() {
        this.context.addBreadcrumb(this.id, this.parentId, this.props.url, this.props.title);
    }

    public componentDidUpdate(prevProps: IProps) {
        if (this.props.url !== prevProps.url || this.props.title !== prevProps.title) {
            this.context.updateBreadcrumb(this.id, this.parentId, this.props.url, this.props.title);
        }
    }

    public componentWillUnmount() {
        this.context.removeBreadcrumb(this.id);
    }
}

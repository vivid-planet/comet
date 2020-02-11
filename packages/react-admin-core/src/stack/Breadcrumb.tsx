import * as React from "react";
import { StackApiContext } from "./Api";
const UUID = require("uuid");

interface IProps {
    url: string;
    title: string;
    invisible?: boolean;
    ignoreParentId?: boolean;
}

const BreadcrumbContext = React.createContext<string>("");

export class StackBreadcrumb extends React.Component<IProps> {
    public static contextType = StackApiContext;
    public id: string;
    private parentId?: string;
    constructor(props: IProps) {
        super(props);
        this.id = UUID.v4();
    }
    public render() {
        return (
            <BreadcrumbContext.Consumer>
                {parentId => {
                    this.parentId = !this.props.ignoreParentId ? parentId : "";
                    return <BreadcrumbContext.Provider value={this.id}>{this.props.children}</BreadcrumbContext.Provider>;
                }}
            </BreadcrumbContext.Consumer>
        );
    }

    public componentDidMount() {
        this.context.addBreadcrumb(this.id, this.parentId, this.props.url, this.props.title, !!this.props.invisible);
    }

    public componentDidUpdate(prevProps: IProps) {
        if (this.props.url !== prevProps.url || this.props.title !== prevProps.title) {
            this.context.updateBreadcrumb(this.id, this.parentId, this.props.url, this.props.title, !!this.props.invisible);
        }
    }

    public componentWillUnmount() {
        this.context.removeBreadcrumb(this.id);
    }
}

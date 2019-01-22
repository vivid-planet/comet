import * as React from "react";
import { StackApiContext } from "./Api";
const UUID = require("uuid");

interface IProps {
    url: string;
    title: string;
}
class Breadcrumb extends React.Component<IProps> {
    public static contextType = StackApiContext;
    public id: string;
    constructor(props: IProps) {
        super(props);
        this.id = UUID.v4();
    }
    public render() {
        return this.props.children;
    }

    public componentDidMount() {
        this.context.addBreadcrumb(this.id, this.props.url, this.props.title);
    }

    public componentDidUpdate(prevProps: IProps) {
        if (this.props.url !== prevProps.url || this.props.title !== prevProps.title) {
            this.context.updateBreadcrumb(this.id, this.props.url, this.props.title);
        }
    }

    public componentWillUnmount() {
        this.context.removeBreadcrumb(this.id);
    }
}

export default Breadcrumb;

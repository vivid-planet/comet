import { History } from "history";
import * as React from "react";
import { match, Route, RouteComponentProps } from "react-router";
import { StackApiContext } from "./Api";
import Breadcrumb from "./Breadcrumb";
import StackPage, { IProps as IPageProps } from "./Page";
const UUID = require("uuid");

interface IProps {
    initialPage?: string;
    title?: string;
    children: Array<React.ReactElement<IPageProps>>;
}
export const StackSwitchApiContext = React.createContext<IStackSwitchApi>({
    activatePage: (pageName: string, payload: string) => {
        return;
    },
});
export interface IStackSwitchApi {
    activatePage: (pageName: string, payload: string) => void;
    id?: string;
}
interface IRouteParams {
    id?: string;
}
class StackSwitch extends React.Component<IProps> {
    public static contextType = StackApiContext;
    public match: match<IRouteParams>;
    private history: History;
    private id: string;

    constructor(props: IProps) {
        super(props);
        this.id = UUID.v4();
    }

    public componentDidMount() {
        if (!this.context) throw new Error("Switch must be wrapped by a Stack");
        this.context.registerSwitch(this.id, this.getInitialPage());
    }
    public componentWillUnmount() {
        if (!this.context) throw new Error("Switch must be wrapped by a Stack");
        this.context.unregisterSwitch(this.id);
    }

    public render() {
        return (
            <Route>
                {(routerProps: RouteComponentProps<IRouteParams>) => {
                    this.history = routerProps.history;
                    this.match = routerProps.match;
                    if (!this.match) return null;

                    return React.Children.map(this.props.children, (page: any) => {
                        const path = this.isInitialPage(page.props.name) ? `${this.match.url}` : `${this.match.url}/:id/${page.props.name}`;
                        return (
                            <Route path={path} exact={this.isInitialPage(page.props.name)}>
                                {(props: RouteComponentProps<IRouteParams>) => {
                                    if (!props.match) return null;
                                    const ret = (
                                        <StackSwitchApiContext.Provider
                                            value={{
                                                activatePage: this.activatePage.bind(this),
                                                id: this.id,
                                            }}
                                        >
                                            {typeof page.props.children === "function"
                                                ? page.props.children(props.match.params.id)
                                                : page.props.children}
                                        </StackSwitchApiContext.Provider>
                                    );
                                    if (this.isInitialPage(page.props.name)) {
                                        return ret;
                                    } else {
                                        return (
                                            <Breadcrumb url={props.match.url} title={page.props.title || page.props.name}>
                                                {ret}
                                            </Breadcrumb>
                                        );
                                    }
                                }}
                            </Route>
                        );
                    });
                }}
            </Route>
        );
    }
    public activatePage(pageName?: string, payload?: string) {
        if (this.isInitialPage(pageName)) {
            this.history.replace(this.match.url);
        } else {
            this.history.replace(this.match.url + "/" + payload + "/" + pageName);
        }
        this.context.pageActivated(this.id, pageName);
    }

    private getInitialPage() {
        let initialPage = this.props.initialPage;
        if (!initialPage) {
            initialPage = this.props.children[0].props.name;
        }
        return initialPage;
    }
    private isInitialPage(pageName?: string) {
        if (!pageName) return true;
        return this.getInitialPage() === pageName;
    }
}

export default StackSwitch;

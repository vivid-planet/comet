import { History } from "history";
import * as React from "react";
import { match, Route, RouteComponentProps } from "react-router";
import { StackApiContext } from "./Api";
import Breadcrumb from "./Breadcrumb";
import StackPage, { IProps as IPageProps } from "./Page";
import SwitchMeta from "./SwitchMeta";
const UUID = require("uuid");

interface IProps {
    initialPage?: string;
    title?: string;
    children: Array<React.ReactElement<IPageProps>>;
}
interface IState {
    pageBreadcrumbTitle?: string;
}
export const StackSwitchApiContext = React.createContext<IStackSwitchApi>({
    activatePage: (pageName: string, payload: string) => {
        return;
    },
    updatePageBreadcrumbTitle: (title?: string) => {
        return;
    },
});
export interface IStackSwitchApi {
    activatePage: (pageName: string, payload: string) => void;
    updatePageBreadcrumbTitle: (title?: string) => void;
    id?: string;
}
interface IRouteParams {
    id?: string;
}
class StackSwitch extends React.Component<IProps, IState> {
    public static contextType = StackApiContext;
    public match: match<IRouteParams>;
    public readonly state = {
        pageBreadcrumbTitle: "",
    };
    private history: History;
    private id: string;

    constructor(props: IProps) {
        super(props);
        this.id = UUID.v4();
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
                                        <SwitchMeta
                                            id={this.id}
                                            activePage={page.props.name}
                                            isInitialPageActive={this.isInitialPage(page.props.name)}
                                        >
                                            <StackSwitchApiContext.Provider
                                                value={{
                                                    activatePage: this.activatePage,
                                                    id: this.id,
                                                    updatePageBreadcrumbTitle: this.updatePageBreadcrumbTitle,
                                                }}
                                            >
                                                {typeof page.props.children === "function"
                                                    ? page.props.children(props.match.params.id)
                                                    : page.props.children}
                                            </StackSwitchApiContext.Provider>
                                        </SwitchMeta>
                                    );
                                    if (this.isInitialPage(page.props.name)) {
                                        return ret;
                                    } else {
                                        return (
                                            <Breadcrumb
                                                url={props.match.url}
                                                title={this.state.pageBreadcrumbTitle || page.props.title || page.props.name}
                                            >
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
    public activatePage = (pageName?: string, payload?: string) => {
        if (this.isInitialPage(pageName)) {
            this.history.replace(this.match.url);
        } else {
            this.history.replace(this.match.url + "/" + payload + "/" + pageName);
        }
    };

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

    private updatePageBreadcrumbTitle = (title?: string) => {
        this.setState({
            pageBreadcrumbTitle: title,
        });
    };
}

export default StackSwitch;

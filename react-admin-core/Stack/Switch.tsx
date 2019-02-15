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
    pageBreadcrumbTitle: {
        [pageName: string]: string | undefined;
    };
}
export const StackSwitchApiContext = React.createContext<IStackSwitchApi>({
    activatePage: (pageName: string, payload: string, subUrl?: string) => {
        return;
    },
    updatePageBreadcrumbTitle: (title?: string) => {
        return;
    },
});
export interface IStackSwitchApi {
    activatePage: (pageName: string, payload: string, subUrl?: string) => void;
    updatePageBreadcrumbTitle: (title?: string) => void;
    id?: string;
}
interface IRouteParams {
    id?: string;
}
class StackSwitch extends React.Component<IProps, IState> {
    public static contextType = StackApiContext;
    public match: match<IRouteParams>;
    private history: History;
    private id: string;
    private activePage: string;

    constructor(props: IProps) {
        super(props);
        this.id = UUID.v4();
        this.state = {
            pageBreadcrumbTitle: {},
        };
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
                                    this.activePage = page.props.name;
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
                                                title={this.state.pageBreadcrumbTitle[page.props.name] || page.props.title || page.props.name}
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
    public activatePage = (pageName: string, payload: string, subUrl?: string) => {
        if (this.isInitialPage(pageName)) {
            this.history.replace(this.match.url);
            if (payload) throw new Error("activating the initialPage must not have a payload");
            if (subUrl) throw new Error("activating the initialPage must not have a subUrl");
        } else {
            this.history.replace(this.match.url + "/" + payload + "/" + pageName + (subUrl ? "/" + subUrl : ""));
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
        if (this.activePage) {
            const pageBreadcrumbTitle = { ...this.state.pageBreadcrumbTitle };
            pageBreadcrumbTitle[this.activePage] = title;
            this.setState({
                pageBreadcrumbTitle,
            });
        }
    };
}

export default StackSwitch;

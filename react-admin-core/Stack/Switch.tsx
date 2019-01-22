import * as React from "react";
import { StackApiContext } from "./Api";
import StackPage, { IProps as IPageProps } from "./Page";
import { Route, RouteComponentProps, match } from "react-router";
import { History } from "history";
import Breadcrumb from "./Breadcrumb";

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
}
interface IRouteParams {
    id?: string;
}
class StackSwitch extends React.Component<IProps> {
    public static contextType = StackApiContext;
    public match: match<IRouteParams>;
    private stackSwitchApi: IStackSwitchApi;
    private history: History;

    constructor(props: IProps) {
        super(props);
        this.stackSwitchApi = {
            activatePage: this.activatePage.bind(this),
        };
    }
    public render() {
        return (
            <React.Fragment>
                <Route>
                    {(routerProps: RouteComponentProps<IRouteParams>) => {
                        this.history = routerProps.history;
                        this.match = routerProps.match;
                        if (!this.match) return null;

                        return React.Children.map(this.props.children, (page: any) => {
                            const isInitialPage = this.isInitialPage(page.props.name);
                            const path = isInitialPage ? `${this.match.url}` : `${this.match.url}/:id/${page.props.name}`;
                            return (
                                <Route path={path} exact={isInitialPage}>
                                    {(props: RouteComponentProps<IRouteParams>) => {
                                        if (!props.match) return null;
                                        const ret = (
                                            <StackSwitchApiContext.Provider value={this.stackSwitchApi}>
                                                {typeof page.props.children === "function"
                                                    ? page.props.children(props.match.params.id)
                                                    : page.props.children}
                                            </StackSwitchApiContext.Provider>
                                        );
                                        if (isInitialPage) {
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
            </React.Fragment>
        );
    }
    public activatePage(pageName?: string, payload?: string) {
        if (this.isInitialPage(pageName)) {
            this.history.replace(this.match.url);
        } else {
            this.history.replace(this.match.url + "/" + payload + "/" + pageName);
        }
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

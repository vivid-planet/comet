import * as React from "react";
import { Route, RouteComponentProps, useHistory, useRouteMatch } from "react-router";
import { StackBreadcrumb } from "./Breadcrumb";
import { IStackPageProps } from "./Page";
import { StackSwitchMeta } from "./SwitchMeta";
const UUID = require("uuid");

interface IProps {
    title?: string;
    children: Array<React.ReactElement<IStackPageProps>>;
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


function useUuid() {
    const ref = React.useRef<string | undefined>(undefined);
    if (ref.current === undefined) {
        ref.current = UUID.v4() as string;
    }
    return ref.current;
}

export function useStackSwitch(options: {
    initialPage: string
}) {
    const id = useUuid();
    const [pageBreadcrumbTitle, setPageBreadcrumbTitle] = React.useState<Record<string, string | undefined>>({});
    const history = useHistory();
    const match = useRouteMatch<IRouteParams>();

    
    const isInitialPage = React.useCallback((pageName?: string) => {
        if (!pageName) return true;
        return options.initialPage === pageName;
    }, [options]);
    
    const activatePage = React.useCallback((pageName: string, payload: string, subUrl?: string) => {
        if (isInitialPage(pageName)) {
            history.push(match.url);
            if (payload) throw new Error("activating the initialPage must not have a payload");
            if (subUrl) throw new Error("activating the initialPage must not have a subUrl");
        } else {
            history.push(match.url + "/" + payload + "/" + pageName + (subUrl ? "/" + subUrl : ""));
        }
    }, [history, isInitialPage, match]);


    // TODO this does not work at all (activePage lives in component, not hook)
    const activePage: string | undefined = undefined;


    const updatePageBreadcrumbTitle = (t?: string) => {
        if (activePage) {
            const title = { ...pageBreadcrumbTitle };
            title[activePage] = t;
            setPageBreadcrumbTitle(title);
        }
    };

    const api: IStackSwitchApi = React.useMemo(() => ({
        activatePage,
        id,
        updatePageBreadcrumbTitle,
    }), [activatePage, id, updatePageBreadcrumbTitle]);

    const StackSwitchWithHookProps = React.useMemo(() => {
        return (props: IProps) => {
            return <StackSwitch {...props} id={id} api={api} isInitialPage={isInitialPage} pageBreadcrumbTitle={pageBreadcrumbTitle} />
        };
    }, [id, api]);

    return {
        api,
        StackSwitch: StackSwitchWithHookProps
    }
}

interface IHookProps {
    id: string;
    api: IStackSwitchApi;
    isInitialPage: (pageName?: string) => boolean;
    pageBreadcrumbTitle: Record<string, string | undefined>
}

const StackSwitch: React.FunctionComponent<IProps & IHookProps> = (props) => {
    const { id, api, isInitialPage, pageBreadcrumbTitle } = props;
    const match = useRouteMatch<IRouteParams>();

    let activePage: string | undefined;

    if (!match) return null;

    return React.Children.map(props.children, (page: any) => {
        const path = isInitialPage(page.props.name) ? `${match.url}` : `${match.url}/:id/${page.props.name}`;
        return (
            <Route path={path} exact={isInitialPage(page.props.name)}>
                {(routeProps: RouteComponentProps<IRouteParams>) => {
                    if (!routeProps.match) return null;
                    activePage = page.props.name;
                    const ret = (
                        <StackSwitchMeta
                            id={id}
                            activePage={page.props.name}
                            isInitialPageActive={isInitialPage(page.props.name)}
                        >
                            <StackSwitchApiContext.Provider
                                value={api}
                            >
                                {typeof page.props.children === "function"
                                    ? page.props.children(routeProps.match.params.id)
                                    : page.props.children}
                            </StackSwitchApiContext.Provider>
                        </StackSwitchMeta>
                    );
                    if (isInitialPage(page.props.name)) {
                        return ret;
                    } else {
                        return (
                            <StackBreadcrumb
                                url={routeProps.match.url}
                                title={pageBreadcrumbTitle[page.props.name] || page.props.title || page.props.name}
                            >
                                {ret}
                            </StackBreadcrumb>
                        );
                    }
                }}
            </Route>
        );
    });
}

import * as React from "react";
import { Route, RouteComponentProps, useHistory, useLocation } from "react-router";

import { StackApiContext } from "./Api";
import { StackBreadcrumb } from "./Breadcrumb";

interface SortNode {
    id: string;
    parentId: string;
}

interface SortTree<TSortNode extends SortNode> {
    children: Array<SortTree<TSortNode>>;
    node?: TSortNode; // root is undefined
}

const sortByParentId = <TSortNode extends SortNode>(nodes: TSortNode[]) => {
    // first build a tree structure
    const addChildrenToNode = (node?: TSortNode) => {
        const currentNodeId = node ? node.id : "";
        const sortTreeNode: SortTree<TSortNode> = {
            node,
            children: [],
        };
        nodes.forEach((e) => {
            if (e.parentId === currentNodeId) {
                sortTreeNode.children.push(addChildrenToNode(e));
            }
        });
        return sortTreeNode;
    };
    const tree = addChildrenToNode(undefined);

    // then traverse this tree
    const preOrderTraverse = (sortTreeNode: SortTree<TSortNode>, fn: (node: TSortNode) => void) => {
        if (sortTreeNode.node) fn(sortTreeNode.node);
        sortTreeNode.children.forEach((e) => {
            preOrderTraverse(e, fn);
        });
    };

    // and re-create a flat array again
    const ret: TSortNode[] = [];
    preOrderTraverse(tree, (node: TSortNode) => {
        ret.push(node);
    });
    return ret;
};

interface StackProps {
    topLevelTitle: React.ReactNode;
    children: React.ReactNode;
}

export interface BreadcrumbItem {
    id: string;
    parentId: string;
    url: string;
    title: React.ReactNode;
    locationUrl?: string;
}

export interface SwitchItem {
    id: string;
    parentId: string;
    isInitialPageActive: boolean;
    activePage?: string;
}

export function Stack(props: StackProps) {
    const [breadcrumbs, setBreadcrumbs] = React.useState<BreadcrumbItem[]>([]);
    const [switches, setSwitches] = React.useState<SwitchItem[]>([]);
    const history = useHistory();
    const location = useLocation();

    const getVisibleBreadcrumbs = React.useCallback(() => {
        return sortByParentId(breadcrumbs).map((i) => {
            return { ...i, url: i.locationUrl ?? i.url };
        });
    }, [breadcrumbs]);

    const goBack = React.useCallback(() => {
        const breadcrumbs = getVisibleBreadcrumbs();
        if (breadcrumbs[breadcrumbs.length - 2]) {
            history.push(breadcrumbs[breadcrumbs.length - 2].url);
        } else {
            history.push(breadcrumbs[breadcrumbs.length - 1].url);
        }
    }, [history, getVisibleBreadcrumbs]);

    const goAllBack = React.useCallback(() => {
        history.push(breadcrumbs[0].url);
    }, [history, breadcrumbs]);

    const addBreadcrumb = React.useCallback((id: string, parentId: string, url: string, title: React.ReactNode) => {
        setBreadcrumbs((old) => {
            return [
                ...old,
                {
                    id,
                    parentId,
                    url,
                    title,
                },
            ];
        });
    }, []);

    const updateBreadcrumb = React.useCallback((id: string, parentId: string, url: string, title: React.ReactNode) => {
        setBreadcrumbs((old) => {
            return old.map((crumb) => {
                return crumb.id === id ? { ...crumb, parentId, url, title } : crumb;
            });
        });
    }, []);

    const removeBreadcrumb = React.useCallback((id: string) => {
        setBreadcrumbs((old) => {
            return old.filter((crumb) => {
                return crumb.id !== id;
            });
        });
    }, []);

    const addSwitchMeta = React.useCallback((id: string, options: { parentId: string; activePage: string; isInitialPageActive: boolean }) => {
        setSwitches((old) => {
            const switches = [...old];
            const index = switches.findIndex((i) => i.id === id);
            if (index === -1) {
                switches.push({ id, ...options });
            } else {
                switches[index] = { id, ...options };
            }
            return switches;
        });
    }, []);

    const removeSwitchMeta = React.useCallback((id: string) => {
        setSwitches((old) => {
            return old.filter((item) => item.id !== id);
        });
    }, []);

    React.useEffect(() => {
        // execute on location change, set locationUrl for the last breadcrumb to the current location
        setBreadcrumbs((old) => {
            const sorted = sortByParentId(old);
            sorted[sorted.length - 1].locationUrl = location.pathname + location.search; // modify object in place
            return [...old]; // clone (with modified object) to new array to trigger a state update
        });
    }, [location]);

    const visibleBreadcrumbs = getVisibleBreadcrumbs();

    return (
        <StackApiContext.Provider
            value={{
                addBreadcrumb: addBreadcrumb,
                updateBreadcrumb: updateBreadcrumb,
                removeBreadcrumb: removeBreadcrumb,
                goBack: goBack,
                goAllBack: goAllBack,

                addSwitchMeta: addSwitchMeta,
                removeSwitchMeta: removeSwitchMeta,
                switches: sortByParentId(switches),
                breadCrumbs: visibleBreadcrumbs,
            }}
        >
            <Route>
                {(routerProps: RouteComponentProps<any>) => {
                    const { topLevelTitle, children } = props;
                    if (!routerProps.match) {
                        return children;
                    }
                    return (
                        <>
                            <StackBreadcrumb title={topLevelTitle} url={routerProps.match.url} ignoreParentId={true}>
                                {children}
                            </StackBreadcrumb>
                        </>
                    );
                }}
            </Route>
        </StackApiContext.Provider>
    );
}

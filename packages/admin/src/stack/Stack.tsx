import * as history from "history";
import * as React from "react";
import { Route, RouteComponentProps } from "react-router";

import { DirtyHandler } from "../DirtyHandler";
import { IDirtyHandlerApi } from "../DirtyHandlerApiContext";
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
}

export interface BreadcrumbItem {
    id: string;
    parentId: string;
    url: string;
    title: React.ReactNode;
    invisible: boolean;
}

export interface SwitchItem {
    id: string;
    parentId: string;
    isInitialPageActive: boolean;
    activePage?: string;
}

function getVisibleBreadcrumbs(breadCrumbs: BreadcrumbItem[]): BreadcrumbItem[] {
    let prev: BreadcrumbItem;
    return sortByParentId(breadCrumbs)
        .map((i) => {
            return { ...i }; // clone so we can modify in filter below
        })
        .filter((i) => {
            if (i.invisible) {
                prev.url = i.url;
                return false;
            }
            prev = i;
            return true;
        });
}

export const Stack: React.FunctionComponent<StackProps> = ({ topLevelTitle, children }) => {
    const historyRef = React.useRef<history.History | undefined>(undefined);
    const dirtyHandlerApiRef = React.useRef<IDirtyHandlerApi | undefined>(undefined);

    const [breadCrumbs, setBreadCrumbs] = React.useState<BreadcrumbItem[]>([]);
    const [switches, setSwitches] = React.useState<SwitchItem[]>([]);

    const visibleBreadCrumbs = getVisibleBreadcrumbs(breadCrumbs);

    const goBack = () => {
        if (visibleBreadCrumbs[visibleBreadCrumbs.length - 2]) {
            historyRef.current?.push(visibleBreadCrumbs[visibleBreadCrumbs.length - 2].url);
        } else {
            historyRef.current?.push(visibleBreadCrumbs[visibleBreadCrumbs.length - 1].url);
        }
    };

    const goAllBack = () => {
        historyRef.current?.push(breadCrumbs[0].url);
    };

    const addBreadcrumb = (id: string, parentId: string, url: string, title: React.ReactNode, invisible: boolean) => {
        setBreadCrumbs([
            ...breadCrumbs,
            {
                id,
                parentId,
                url,
                title,
                invisible,
            },
        ]);
    };

    const updateBreadcrumb = (id: string, parentId: string, url: string, title: React.ReactNode, invisible: boolean) => {
        setBreadCrumbs(
            breadCrumbs.map((crumb) => {
                return crumb.id === id ? { id, parentId, url, title, invisible } : crumb;
            }),
        );
    };

    const removeBreadcrumb = (id: string) => {
        const index = breadCrumbs.findIndex((crumb) => {
            return crumb.id === id;
        });
        const filteredBreadcrumbs = breadCrumbs.splice(index, 1);
        setBreadCrumbs(filteredBreadcrumbs);
    };

    const addSwitchMeta = (id: string, options: { parentId: string; activePage: string; isInitialPageActive: boolean }) => {
        const switchesCopy = [...switches];
        const index = switchesCopy.findIndex((i) => i.id === id);
        if (index === -1) {
            switchesCopy.push({ id, ...options });
        } else {
            switchesCopy[index] = { id, ...options };
        }
        setSwitches(switchesCopy);
    };

    const removeSwitchMeta = (id: string) => {
        const index = switches.findIndex((item) => {
            return item.id === id;
        });
        const filteredSwitches = switches.splice(index, 1);
        setSwitches(filteredSwitches);
    };

    return (
        <StackApiContext.Provider
            value={{
                addBreadcrumb,
                updateBreadcrumb,
                removeBreadcrumb,
                goBack,
                goAllBack,
                addSwitchMeta,
                removeSwitchMeta,
                switches: sortByParentId(switches),
                breadCrumbs: visibleBreadCrumbs,
            }}
        >
            <Route>
                {(routerProps: RouteComponentProps<any>) => {
                    historyRef.current = routerProps.history;
                    return (
                        <>
                            <StackBreadcrumb title={topLevelTitle} url={routerProps.match.url} ignoreParentId={true}>
                                <DirtyHandler
                                    ref={(ref) => {
                                        dirtyHandlerApiRef.current = ref ? ref.dirtyHandlerApi : undefined;
                                    }}
                                >
                                    {children}
                                </DirtyHandler>
                            </StackBreadcrumb>
                        </>
                    );
                }}
            </Route>
        </StackApiContext.Provider>
    );
};

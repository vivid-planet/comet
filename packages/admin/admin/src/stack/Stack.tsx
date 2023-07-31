import * as history from "history";
import * as React from "react";
import { Route, RouteComponentProps } from "react-router";

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

interface IState {
    breadcrumbs: BreadcrumbItem[];
    switches: SwitchItem[];
}

export class Stack extends React.Component<StackProps, IState> {
    private history: history.History;
    constructor(props: StackProps) {
        super(props);
        this.state = {
            breadcrumbs: [],
            switches: [],
        };
    }

    public render() {
        const breadcrumbs = this.getVisibleBreadcrumbs();

        return (
            <StackApiContext.Provider
                value={{
                    addBreadcrumb: this.addBreadcrumb.bind(this),
                    updateBreadcrumb: this.updateBreadcrumb.bind(this),
                    removeBreadcrumb: this.removeBreadcrumb.bind(this),
                    goBack: this.goBack.bind(this),
                    goAllBack: this.goAllBack.bind(this),

                    addSwitchMeta: this.addSwitchMeta,
                    removeSwitchMeta: this.removeSwitchMeta,
                    switches: sortByParentId(this.state.switches),
                    breadCrumbs: breadcrumbs,
                }}
            >
                <Route>
                    {(routerProps: RouteComponentProps<any>) => {
                        const { topLevelTitle, children } = this.props;
                        this.history = routerProps.history;
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

    private getVisibleBreadcrumbs() {
        let prev: BreadcrumbItem;
        const breadcrumbs = sortByParentId(this.state.breadcrumbs)
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
        return breadcrumbs;
    }

    private goBack() {
        const breadcrumbs = this.getVisibleBreadcrumbs();
        if (breadcrumbs[breadcrumbs.length - 2]) {
            this.history.push(breadcrumbs[breadcrumbs.length - 2].url);
        } else {
            this.history.push(breadcrumbs[breadcrumbs.length - 1].url);
        }
    }

    private goAllBack() {
        this.history.push(this.state.breadcrumbs[0].url);
    }

    private addBreadcrumb(id: string, parentId: string, url: string, title: React.ReactNode, invisible: boolean) {
        this.setState((state) => {
            const breadcrumbs = [
                ...state.breadcrumbs,
                {
                    id,
                    parentId,
                    url,
                    title,
                    invisible,
                },
            ];

            return {
                breadcrumbs,
            };
        });
    }

    private updateBreadcrumb(id: string, parentId: string, url: string, title: React.ReactNode, invisible: boolean) {
        this.setState((state) => {
            const breadcrumbs = state.breadcrumbs.map((crumb) => {
                return crumb.id === id ? { id, parentId, url, title, invisible } : crumb;
            });
            return {
                breadcrumbs,
            };
        });
    }

    private removeBreadcrumb(id: string) {
        this.setState((state) => {
            const breadcrumbs = state.breadcrumbs.filter((crumb) => {
                return crumb.id !== id;
            });
            return {
                breadcrumbs,
            };
        });
    }

    private addSwitchMeta = (id: string, options: { parentId: string; activePage: string; isInitialPageActive: boolean }) => {
        this.setState((state) => {
            const switches = [...state.switches];
            const index = switches.findIndex((i) => i.id === id);
            if (index === -1) {
                switches.push({ id, ...options });
            } else {
                switches[index] = { id, ...options };
            }
            return {
                switches,
            };
        });
    };

    private removeSwitchMeta = (id: string) => {
        this.setState((state) => {
            const switches = state.switches.filter((item) => item.id !== id);
            return {
                switches,
            };
        });
    };
}

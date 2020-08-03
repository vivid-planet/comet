import Button from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Breadcrumbs } from "@vivid-planet/react-admin-mui";
import * as history from "history";
import * as React from "react";
import { Route, RouteComponentProps } from "react-router";
import { DirtyHandler } from "../DirtyHandler";
import { IDirtyHandlerApi } from "../DirtyHandlerApiContext";
import { StackApiContext } from "./Api";
import { StackBreadcrumb } from "./Breadcrumb";
import * as sc from "./Stack.sc";

export const StackBreadcrumbsContainer = sc.BreadcrumbsContainer;

interface ISortNode {
    id: string;
    parentId: string;
}

interface ISortTree<TSortNode extends ISortNode> {
    children: Array<ISortTree<TSortNode>>;
    node?: TSortNode; // root is undefined
}

const sortByParentId = <TSortNode extends ISortNode>(nodes: TSortNode[]) => {
    // first build a tree structure
    const addChildrenToNode = (node?: TSortNode) => {
        const currentNodeId = node ? node.id : "";
        const sortTreeNode: ISortTree<TSortNode> = {
            node,
            children: [],
        };
        nodes.forEach(e => {
            if (e.parentId === currentNodeId) {
                sortTreeNode.children.push(addChildrenToNode(e));
            }
        });
        return sortTreeNode;
    };
    const tree = addChildrenToNode(undefined);

    // then traverse this tree
    const preOrderTraverse = (sortTreeNode: ISortTree<TSortNode>, fn: (node: TSortNode) => void) => {
        if (sortTreeNode.node) fn(sortTreeNode.node);
        sortTreeNode.children.forEach(e => {
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

interface IProps {
    topLevelTitle: string;
    showBackButton?: boolean;
    showBreadcrumbs?: boolean;
    components?: {
        breadcrumbsContainer?: React.ComponentType;
    };
}
interface IBreadcrumbItem {
    id: string;
    parentId: string;
    url: string;
    title: string;
    invisible: boolean;
}
interface ISwitchItem {
    id: string;
    parentId: string;
    isInitialPageActive: boolean;
    activePage?: string;
}
interface IState {
    breadcrumbs: IBreadcrumbItem[];
    switches: ISwitchItem[];
}
export class Stack extends React.Component<IProps, IState> {
    private dirtyHandlerApi?: IDirtyHandlerApi;
    private history: history.History;
    constructor(props: IProps) {
        super(props);
        this.state = {
            breadcrumbs: [],
            switches: [],
        };
    }

    public render() {
        const breadcrumbs = this.getVisibleBreadcrumbs();
        const BreadcrumbsContainer =
            this.props.components && this.props.components.breadcrumbsContainer
                ? this.props.components.breadcrumbsContainer
                : sc.BreadcrumbsContainer;
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
                }}
            >
                <Route>
                    {(routerProps: RouteComponentProps<any>) => {
                        const { showBreadcrumbs = true } = this.props;
                        this.history = routerProps.history;
                        return (
                            <>
                                {showBreadcrumbs && (
                                    <BreadcrumbsContainer>
                                        <Breadcrumbs pages={breadcrumbs} />
                                    </BreadcrumbsContainer>
                                )}
                                {this.props.showBackButton && (
                                    <Button color="default" disabled={breadcrumbs.length <= 1} onClick={this.handleGoBackClick}>
                                        Zurück
                                        <ArrowBackIcon />
                                    </Button>
                                )}
                                <StackBreadcrumb title={this.props.topLevelTitle} url={routerProps.match.url} ignoreParentId={true}>
                                    <DirtyHandler
                                        ref={ref => {
                                            this.dirtyHandlerApi = ref ? ref.dirtyHandlerApi : undefined;
                                        }}
                                    >
                                        {this.props.children}
                                    </DirtyHandler>
                                </StackBreadcrumb>
                            </>
                        );
                    }}
                </Route>
            </StackApiContext.Provider>
        );
    }

    private getVisibleBreadcrumbs() {
        let prev: IBreadcrumbItem;
        const breadcrumbs = sortByParentId(this.state.breadcrumbs)
            .map(i => {
                return { ...i }; // clone so we can modify in filter below
            })
            .filter(i => {
                if (i.invisible) {
                    prev.url = i.url;
                    return false;
                }
                prev = i;
                return true;
            });
        return breadcrumbs;
    }

    private handleGoBackClick = () => {
        this.goBack();
    };

    private goBack() {
        const breadcrumbs = this.getVisibleBreadcrumbs();
        if (!!breadcrumbs[breadcrumbs.length - 2]) {
            this.history.push(breadcrumbs[breadcrumbs.length - 2].url);
        } else {
            this.history.push(breadcrumbs[breadcrumbs.length - 1].url);
        }
    }

    private goAllBack() {
        this.history.push(this.state.breadcrumbs[0].url);
    }

    private addBreadcrumb(id: string, parentId: string, url: string, title: string, invisible: boolean) {
        this.setState(state => {
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

    private updateBreadcrumb(id: string, parentId: string, url: string, title: string, invisible: boolean) {
        this.setState(state => {
            const breadcrumbs = state.breadcrumbs.map(crumb => {
                return crumb.id === id ? { id, parentId, url, title, invisible } : crumb;
            });
            return {
                breadcrumbs,
            };
        });
    }

    private removeBreadcrumb(id: string) {
        this.setState(state => {
            const breadcrumbs = state.breadcrumbs.filter(crumb => {
                return crumb.id !== id;
            });
            return {
                breadcrumbs,
            };
        });
    }

    private addSwitchMeta = (id: string, options: { parentId: string; activePage: string; isInitialPageActive: boolean }) => {
        this.setState(state => {
            const switches = [...state.switches];
            const index = switches.findIndex(i => i.id === id);
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
        this.setState(state => {
            const switches = state.switches.filter(item => item.id !== id);
            return {
                switches,
            };
        });
    };
}

import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Breadcrumbs } from "@vivid-planet/react-admin-mui";
import * as history from "history";
import * as React from "react";
import { match, Route, RouteComponentProps } from "react-router";
import DirtyHandler from "../DirtyHandler";
import { IDirtyHandlerApi } from "../DirtyHandlerApiContext";
import IStackApi, { StackApiContext } from "./Api";
import Breadcrumb from "./Breadcrumb";

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
}
interface IBreadcrumbItem {
    id: string;
    parentId: string;
    url: string;
    title: string;
    invisible: boolean;
}
interface IState {
    breadcrumbs: IBreadcrumbItem[];
    switches: Array<{
        id: string;
        isInitialPageActive: boolean;
        activePage?: string;
    }>;
}
class Stack extends React.Component<IProps, IState> {
    private breadcrumbs: IBreadcrumbItem[]; // duplicates this.state.breadcrumbs, needed for multiple calls that modify state.breadcrumbs as setState updates this.state deferred
    private dirtyHandlerApi?: IDirtyHandlerApi;
    private history: history.History;
    constructor(props: IProps) {
        super(props);
        this.breadcrumbs = [];
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
                    goBackForce: this.goBackForce.bind(this),

                    addSwitchMeta: this.addSwitchMeta,
                    removeSwitchMeta: this.removeSwitchMeta,
                    switches: this.state.switches,
                }}
            >
                <Route>
                    {(routerProps: RouteComponentProps<any>) => {
                        this.history = routerProps.history;
                        return (
                            <>
                                <Toolbar>
                                    <Breadcrumbs pages={breadcrumbs} />
                                </Toolbar>

                                <Button color="default" disabled={breadcrumbs.length <= 1} onClick={this.handleGoBackClick}>
                                    Zurück
                                    <ArrowBackIcon />
                                </Button>

                                <Breadcrumb title={this.props.topLevelTitle} url={routerProps.match.url}>
                                    <DirtyHandler
                                        ref={ref => {
                                            this.dirtyHandlerApi = ref ? ref.dirtyHandlerApi : undefined;
                                        }}
                                    >
                                        {this.props.children}
                                    </DirtyHandler>
                                </Breadcrumb>
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

    private goBackForce() {
        const breadcrumbs = this.getVisibleBreadcrumbs();
        this.history.replace(breadcrumbs[breadcrumbs.length - 2].url);
    }

    private async goBack() {
        if (this.dirtyHandlerApi) {
            await this.dirtyHandlerApi.askSaveIfDirty();
        }
        this.goBackForce();
    }

    private async goAllBack() {
        if (this.dirtyHandlerApi) {
            await this.dirtyHandlerApi.askSaveIfDirty();
        }
        this.history.replace(this.state.breadcrumbs[0].url);
    }

    private addBreadcrumb(id: string, parentId: string, url: string, title: string, invisible: boolean) {
        const breadcrumbs = [
            ...this.breadcrumbs,
            {
                id,
                parentId,
                url,
                title,
                invisible,
            },
        ];
        this.setState({
            breadcrumbs,
        });
        this.breadcrumbs = breadcrumbs;
    }

    private updateBreadcrumb(id: string, parentId: string, url: string, title: string, invisible: boolean) {
        const breadcrumbs = this.breadcrumbs.map(crumb => {
            return crumb.id === id ? { id, parentId, url, title, invisible } : crumb;
        });
        this.setState({
            breadcrumbs,
        });
        this.breadcrumbs = breadcrumbs;
    }

    private removeBreadcrumb(id: string) {
        const breadcrumbs = this.breadcrumbs.filter(crumb => {
            return crumb.id !== id;
        });
        this.setState({
            breadcrumbs,
        });
        this.breadcrumbs = breadcrumbs;
    }

    private addSwitchMeta = (id: string, options: { activePage: string; isInitialPageActive: boolean }) => {
        this.setState({
            switches: [
                ...this.state.switches,
                {
                    id,
                    ...options,
                },
            ],
        });
        const switches = [...this.state.switches];
        const index = switches.findIndex(i => i.id === id);
        if (index === -1) {
            switches.push({ id, ...options });
        } else {
            switches[index] = { id, ...options };
        }
        this.setState({
            switches,
        });
    };
    private removeSwitchMeta = (id: string) => {
        this.setState({
            switches: this.state.switches.filter(item => item.id !== id),
        });
    };
}

export default Stack;

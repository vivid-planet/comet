import { History } from "history";
import * as React from "react";
import { match, RouteComponentProps } from "react-router";
import { Route } from "react-router-dom";
import { IDirtyHandlerApi } from "./DirtyHandlerApiContext";
import { ISelectionApi } from "./SelectionApi";

export interface ISelectionRouterRenderPropArgs {
    selectedId?: string;
    selectionMode?: "edit" | "add";
    selectionApi: ISelectionApi;
}

interface IProps {
    children: (injectedProps: ISelectionRouterRenderPropArgs) => React.ReactNode;
}

interface IRouteParams {
    id?: string;
}
export class SelectionRoute extends React.Component<IProps> {
    public selectionApi: ISelectionApi;
    private dirtyHandlerApi?: IDirtyHandlerApi;
    private history: History;
    private match: match<IRouteParams>;

    constructor(props: IProps) {
        super(props);

        this.selectionApi = {
            handleSelectId: this.handleSelectId.bind(this),
            handleDeselect: this.handleDeselect.bind(this),
            handleAdd: this.handleAdd.bind(this),
        };
        this.state = {
            noop: null,
        };
    }

    public render() {
        return (
            <Route>
                {(routerProps: RouteComponentProps<IRouteParams>) => {
                    this.history = routerProps.history;
                    this.match = routerProps.match;
                    const path = this.match ? `${this.match.url}/:id` : undefined;
                    return (
                        <Route path={path}>
                            {(props: RouteComponentProps<IRouteParams>) => {
                                let selectedId: string | undefined;
                                let selectionMode: "edit" | "add" | undefined;
                                if (props.match && props.match.params.id === "add") {
                                    selectedId = undefined;
                                    selectionMode = "add";
                                } else if (props.match) {
                                    selectedId = props.match.params.id;
                                    selectionMode = "edit";
                                }
                                return this.props.children({
                                    selectedId,
                                    selectionMode,
                                    selectionApi: this.selectionApi,
                                });
                            }}
                        </Route>
                    );
                }}
            </Route>
        );
    }

    private async handleSelectId(id: string) {
        this.history.push(`${this.match.url}/${id}`);
    }

    private async handleDeselect() {
        this.history.push(`${this.match.url}`);
    }

    private handleAdd() {
        this.history.push(`${this.match.url}/add`);
    }
}

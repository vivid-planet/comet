import { History } from "history";
import * as React from "react";
import { match, RouteComponentProps } from "react-router";
import { Route } from "react-router-dom";
import DirtyHandlerApiContext, { IDirtyHandlerApi } from "./DirtyHandlerApiContext";
import ISelectionApi from "./SelectionApi";

export interface IRenderPropArgs {
    selectedId?: string;
    selectionMode?: "edit" | "add";
    selectionApi: ISelectionApi;
}

interface IProps {
    children: (injectedProps: IRenderPropArgs) => React.ReactNode;
}

interface IRouteParams {
    id?: string;
}
class SelectionRoute extends React.Component<IProps> {
    public selectionApi: ISelectionApi;
    private dirtyHandlerApi?: IDirtyHandlerApi;
    private history: History;
    private match: match<IRouteParams>;

    constructor(props: IProps) {
        super(props);

        this.selectionApi = {
            handleSelectId: this.handleSelectId.bind(this),
            handleDeselect: this.handleDeselect.bind(this),
            selectIdWithoutDirtyCheck: this.selectIdWithoutDirtyCheck.bind(this),
            deselectWithoutDirtyCheck: this.deselectWithoutDirtyCheck.bind(this),
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
                                let selectionMode: "edit" | "add";
                                if (props.match && props.match.params.id === "add") {
                                    selectedId = undefined;
                                    selectionMode = "add";
                                } else if (props.match) {
                                    selectedId = props.match.params.id;
                                    selectionMode = "edit";
                                }
                                return (
                                    <DirtyHandlerApiContext.Consumer>
                                        {dirtyHandlerApi => {
                                            // don't use withDirtyHAndlerApi HOC to avoid ref issues
                                            this.dirtyHandlerApi = dirtyHandlerApi;
                                            return this.props.children({
                                                selectedId,
                                                selectionMode,
                                                selectionApi: this.selectionApi,
                                            });
                                        }}
                                    </DirtyHandlerApiContext.Consumer>
                                );
                            }}
                        </Route>
                    );
                }}
            </Route>
        );
    }

    private async handleSelectId(id: string) {
        if (this.dirtyHandlerApi) {
            try {
                await this.dirtyHandlerApi.askSaveIfDirty();
            } catch (e) {
                // saving changes failed, stop selecting id
                // TODO should this really catch the error silently?
                return;
            }
        }
        this.selectIdWithoutDirtyCheck(id);
    }

    private async handleDeselect() {
        if (this.dirtyHandlerApi) {
            try {
                await this.dirtyHandlerApi.askSaveIfDirty();
            } catch (e) {
                // saving changes failed, stop selecting id
                // TODO should this really catch the error silently?
                return;
            }
        }
        this.deselectWithoutDirtyCheck();
    }
    private deselectWithoutDirtyCheck() {
        this.history.replace(`${this.match.url}`);
    }
    private selectIdWithoutDirtyCheck(id: string) {
        this.history.replace(`${this.match.url}/${id}`);
    }

    private async handleAdd() {
        if (this.dirtyHandlerApi) {
            try {
                await this.dirtyHandlerApi.askSaveIfDirty();
            } catch (e) {
                // saving changes failed, stop selecting id
                // TODO should this really catch the error silently?
                return;
            }
        }
        this.history.replace(`${this.match.url}/add`);
    }
}
export default SelectionRoute;

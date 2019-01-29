import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import * as history from "history";
import * as React from "react";
import { match, Route, RouteComponentProps } from "react-router";
import DirtyHandler from "../DirtyHandler";
import { IDirtyHandlerApi } from "../DirtyHandlerApiContext";
import IStackApi, { StackApiContext } from "./Api";
import Breadcrumb from "./Breadcrumb";
import { Breadcrumbs } from "@vivid-planet/react-admin-mui";

interface IProps {
    topLevelTitle: string;
}
interface IBreadcrumbItem {
    id: string;
    url: string;
    title: string;
}
interface IState {
    breadcrumbs: IBreadcrumbItem[];
}
class Stack extends React.Component<IProps, IState> {
    public stackApi: IStackApi;
    private breadcrumbs: IBreadcrumbItem[]; // duplicates this.state.breadcrumbs, needed for multiple calls that modify state.breadcrumbs as setState updates this.state deferred
    private dirtyHandlerApi?: IDirtyHandlerApi;
    private history: history.History;
    constructor(props: IProps) {
        super(props);
        this.stackApi = {
            addBreadcrumb: this.addBreadcrumb.bind(this),
            updateBreadcrumb: this.updateBreadcrumb.bind(this),
            removeBreadcrumb: this.removeBreadcrumb.bind(this),
            goBack: this.goBack.bind(this),
            goAllBack: this.goAllBack.bind(this),
            goBackForce: this.goBackForce.bind(this),
        };
        this.breadcrumbs = [];
        this.state = {
            breadcrumbs: [],
        };
    }

    public render() {
        return (
            <StackApiContext.Provider value={this.stackApi}>
                <Route>
                    {(routerProps: RouteComponentProps<any>) => {
                        this.history = routerProps.history;
                        return (
                            <>
                                <Toolbar>
                                    <Breadcrumbs pages={this.state.breadcrumbs} />
                                </Toolbar>

                                <Button color="default" disabled={this.state.breadcrumbs.length <= 1} onClick={this.handleGoBackClick}>
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

    private handleGoBackClick = () => {
        this.goBack();
    };

    private goBackForce() {
        this.history.replace(this.state.breadcrumbs[this.state.breadcrumbs.length - 2].url);
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

    private addBreadcrumb(id: string, url: string, title: string) {
        const breadcrumbs = [
            ...this.breadcrumbs,
            {
                id,
                url,
                title,
            },
        ];
        this.setState({
            breadcrumbs,
        });
        this.breadcrumbs = breadcrumbs;
    }

    private updateBreadcrumb(id: string, url: string, title: string) {
        const breadcrumbs = this.breadcrumbs.map(crumb => {
            return crumb.id === id ? { id, url, title } : crumb;
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
}

export default Stack;

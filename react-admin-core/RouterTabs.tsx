import AppBar from "@material-ui/core/AppBar";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import MaterialTab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { Route, RouteComponentProps, withRouter } from "react-router-dom";
import { StackApiContext } from "./Stack/Api";
import Breadcrumb from "./Stack/Breadcrumb";
import { StackSwitchApiContext } from "./Stack/Switch";

interface ITabProps {
    path: string;
    label: string;
    forceRender?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
}
export const Tab: React.SFC<ITabProps> = () => null;

function TabContainer(props: any) {
    return (
        <Typography component="div" style={{ padding: "24px 0", ...(props.style || {}) }}>
            {props.children}
        </Typography>
    );
}

const styles = (theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.paper,
        },
    });

interface IProps extends RouteComponentProps {
    classes: {
        root: string;
    };
    children: Array<React.ReactElement<ITabProps>> | React.ReactElement<ITabProps>;
}
class RouterTabs extends React.Component<IProps> {
    public render() {
        const { classes } = this.props;

        const paths = React.Children.map(this.props.children, (child: React.ReactElement<ITabProps>) => {
            if (child.type !== Tab) {
                throw new Error("RouterTabs must contain only Tab children");
            }
            return child.props.path;
        });

        return (
            <div className={classes.root}>
                <StackApiContext.Consumer>
                    {stackApi => (
                        <StackSwitchApiContext.Consumer>
                            {stackSwitchApi => {
                                const ret = (
                                    <Route path={`${this.props.match.url}/:tab`}>
                                        {({ match }) => {
                                            const path = match ? "/" + match.params.tab : "";
                                            const value = paths.indexOf(path);
                                            return (
                                                <AppBar position="static">
                                                    <Tabs value={value} onChange={this.handleChange}>
                                                        {React.Children.map(this.props.children, (child: React.ReactElement<ITabProps>) => (
                                                            <MaterialTab label={child.props.label} disabled={child.props.disabled} />
                                                        ))}
                                                    </Tabs>
                                                </AppBar>
                                            );
                                        }}
                                    </Route>
                                );

                                if (stackApi && stackSwitchApi) {
                                    // When inside a Stack show only the last TabBar
                                    const ownSwitchIndex = stackSwitchApi.id ? stackApi.switches.findIndex(i => i.id === stackSwitchApi.id) : -1;
                                    const nextSwitchShowsInitialPage =
                                        stackApi.switches[ownSwitchIndex + 1] && stackApi.switches[ownSwitchIndex + 1].isInitialPageActive;
                                    const shouldShowTabBar = ownSwitchIndex === stackApi.switches.length - (nextSwitchShowsInitialPage ? 2 : 1);
                                    if (!shouldShowTabBar) {
                                        return null;
                                    }
                                }
                                return ret;
                            }}
                        </StackSwitchApiContext.Consumer>
                    )}
                </StackApiContext.Consumer>
                {React.Children.map(this.props.children, (child: React.ReactElement<ITabProps>) => {
                    return (
                        <Route path={`${this.props.match.url}${child.props.path}`} exact={child.props.path === ""}>
                            {({ match }) => {
                                if (!match && !child.props.forceRender) {
                                    return null;
                                }
                                if (match) {
                                    return (
                                        <Breadcrumb url={`${this.props.match.url}${child.props.path}`} title={child.props.label} invisible={true}>
                                            <TabContainer>{child.props.children}</TabContainer>
                                        </Breadcrumb>
                                    );
                                } else {
                                    return <TabContainer style={{ display: "none" }}>{child.props.children}</TabContainer>;
                                }
                            }}
                        </Route>
                    );
                })}
            </div>
        );
    }

    private handleChange = (event: {}, value: number) => {
        const paths = React.Children.map(this.props.children, (child: React.ReactElement<ITabProps>) => {
            return child.props.path;
        });
        this.props.history.replace(this.props.match.url + paths[value]);
    };
}
const ExtendedRouterTabs = withStyles(styles)(withRouter(RouterTabs));

export default ExtendedRouterTabs;

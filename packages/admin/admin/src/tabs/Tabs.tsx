import { ComponentsOverrides, Theme } from "@mui/material";
import MuiTabs, { TabsProps as MuiTabsProps } from "@mui/material/Tabs";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

import { CustomDivider, Divider, DividerProps } from "./CustomDivider";
import { CustomTab, Tab, TabProps } from "./Tab";
import { styles, TabsClassKey } from "./Tabs.styles";
import { TabScrollButton } from "./TabScrollButton";

interface ITabsState {
    value: number;
    setValue: (value: number) => void;
}

export interface TabsProps extends MuiTabsProps {
    children: Array<React.ReactElement<TabProps | DividerProps> | boolean | null | undefined>;
    tabComponent?: React.ComponentType<TabProps>;
    defaultIndex?: number;
    tabsState?: ITabsState;
    smallTabText?: boolean;
}

function TabsComponent({
    children,
    tabComponent: TabComponent = CustomTab,
    defaultIndex,
    tabsState,
    ScrollButtonComponent = TabScrollButton,
    classes,
    smallTabText,
    ...restProps
}: TabsProps & WithStyles<typeof styles>) {
    let value: ITabsState["value"];
    let setValue: ITabsState["setValue"];

    const state = React.useState(defaultIndex !== undefined ? defaultIndex : 0);
    if (tabsState === undefined) {
        value = state[0];
        setValue = state[1];
    } else {
        value = tabsState.value;
        setValue = tabsState.setValue;
    }

    const handleChange = (event: React.ChangeEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <MuiTabs
                classes={{ root: classes.tabs }}
                value={value}
                onChange={handleChange}
                ScrollButtonComponent={ScrollButtonComponent}
                scrollButtons="auto"
                variant="scrollable"
                {...restProps}
            >
                {React.Children.map(children, (child: React.ReactElement<TabProps | DividerProps>) => {
                    if (React.isValidElement<TabProps>(child) && child.type === Tab) {
                        const { children, ...restChildProps } = child.props;
                        return <TabComponent {...(restChildProps as TabProps)} smallTabText={smallTabText} currentTab={value} />;
                    } else if (React.isValidElement<DividerProps>(child) && child.type === Divider) {
                        return <CustomDivider {...child.props} />;
                    } else {
                        throw new Error(`Tabs may only contain tab or divider components as children. Found ${child.type} component/ tag.`);
                    }
                })}
            </MuiTabs>
            {React.Children.map(children, (child: React.ReactElement<TabProps>, index) => {
                if (!React.isValidElement<TabProps>(child)) {
                    return null;
                }

                if (index === value) {
                    return <div className={classes.content}>{child.props.children}</div>;
                } else if (child.props.forceRender) {
                    return <div className={`${classes.content} ${classes.contentHidden}`}>{child.props.children}</div>;
                }
            })}
        </div>
    );
}

export const Tabs = withStyles(styles, { name: "CometAdminTabs" })(TabsComponent);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminTabs: TabsClassKey;
    }

    interface ComponentsPropsList {
        CometAdminTabs: TabsProps;
    }

    interface Components {
        CometAdminTabs?: {
            defaultProps?: ComponentsPropsList["CometAdminTabs"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminTabs"];
        };
    }
}

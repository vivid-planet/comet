import { ComponentsOverrides, Theme } from "@mui/material";
import MuiTab, { TabProps as MuiTabProps } from "@mui/material/Tab";
import MuiTabs, { TabsProps as MuiTabsProps } from "@mui/material/Tabs";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

import { styles, TabsClassKey } from "./Tabs.styles";
import { TabScrollButton } from "./TabScrollButton";

interface TabProps extends Omit<MuiTabProps, "children"> {
    label: React.ReactNode;
    forceRender?: boolean;
    children: React.ReactNode;
}

export const Tab: React.SFC<TabProps> = () => null;

interface ITabsState {
    value: number;
    setValue: (value: number) => void;
}

export interface TabsProps extends MuiTabsProps {
    children: Array<React.ReactElement<TabProps> | boolean | null | undefined> | React.ReactElement<TabProps>;
    tabComponent?: React.ComponentType<MuiTabProps>;
    defaultIndex?: number;
    tabsState?: ITabsState;
}

function TabsComponent({
    children,
    tabComponent: TabComponent = MuiTab,
    defaultIndex,
    tabsState,
    ScrollButtonComponent = TabScrollButton,
    classes,
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

    React.Children.forEach(children, (child: React.ReactElement<TabProps>) => {
        // as seen in https://github.com/mui-org/material-ui/blob/v4.11.0/packages/material-ui/src/Tabs/Tabs.js#L390
        if (!React.isValidElement<TabProps>(child)) {
            return null;
        }

        if (child.type !== Tab) {
            throw new Error("RouterTabs must contain only Tab children");
        }
    });

    return (
        <div className={classes.root}>
            <MuiTabs
                classes={{ root: classes.tabs }}
                value={value}
                onChange={handleChange}
                ScrollButtonComponent={ScrollButtonComponent}
                {...restProps}
            >
                {React.Children.map(children, (child: React.ReactElement<TabProps>) => {
                    if (!React.isValidElement<TabProps>(child)) {
                        return null;
                    }

                    const { children, label, ...restTabProps } = child.props;
                    return <TabComponent label={label} {...restTabProps} />;
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
        CometAdminTabs: Partial<TabsProps>;
    }

    interface Components {
        CometAdminTabs?: {
            defaultProps?: ComponentsPropsList["CometAdminTabs"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminTabs"];
        };
    }
}

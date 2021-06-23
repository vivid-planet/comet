import { StyledComponentProps } from "@material-ui/core/styles";
import MuiTab, { TabProps as MuiTabProps } from "@material-ui/core/Tab";
import MuiTabs, { TabsProps as MuiTabsProps } from "@material-ui/core/Tabs";
import * as React from "react";

import { mergeClasses } from "../helpers/mergeClasses";
import { CometAdminTabsClassKeys, useStyles } from "./Tabs.styles";
import { TabScrollButton } from "./TabScrollButton";

interface TabProps extends MuiTabProps {
    label: React.ReactNode;
    children: React.ReactNode;
}

export const Tab: React.SFC<TabProps> = () => null;

interface ITabsState {
    value: number;
    setValue: (value: number) => void;
}

interface Props extends MuiTabsProps {
    children: Array<React.ReactElement<TabProps>> | React.ReactElement<TabProps>;
    tabComponent?: React.ComponentType<MuiTabProps>;
    defaultIndex?: number;
    tabsState?: ITabsState;
}

export function Tabs({
    children,
    tabComponent: TabComponent = MuiTab,
    defaultIndex,
    tabsState,
    ScrollButtonComponent = TabScrollButton,
    classes: passedClasses,
    ...restProps
}: Props & StyledComponentProps<CometAdminTabsClassKeys>) {
    const classes = mergeClasses<CometAdminTabsClassKeys>(useStyles(), passedClasses);

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

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    React.Children.forEach(children, (child: React.ReactElement<TabProps>) => {
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
                    const { children, label, ...restTabProps } = child.props;
                    return <TabComponent label={label} {...restTabProps} />;
                })}
            </MuiTabs>
            {React.Children.map(children, (child: React.ReactElement<TabProps>, index) => {
                if (index === value) {
                    return <div className={classes.content}>{child.props.children}</div>;
                }
            })}
        </div>
    );
}

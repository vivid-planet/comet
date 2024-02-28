import { ComponentsOverrides } from "@mui/material";
import { css, styled, Theme, useThemeProps } from "@mui/material/styles";
import MuiTab, { TabProps as MuiTabProps } from "@mui/material/Tab";
import MuiTabs, { TabsProps as MuiTabsProps } from "@mui/material/Tabs";
import * as React from "react";

import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";
import { TabScrollButton } from "./TabScrollButton";

export type TabsClassKey = "root" | "tabs" | "content" | "contentHidden";

type OwnerState = { contentHidden?: boolean };

const Root = styled("div", {
    name: "CometAdminTabs",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})();

const StyledTabs = styled(MuiTabs, {
    name: "CometAdminTabs",
    slot: "tabs",
    overridesResolver(_, styles) {
        return [styles.tabs];
    },
})();

const Content = styled("div", {
    name: "CometAdminTabs",
    slot: "content",
    overridesResolver({ ownerState }: { ownerState: OwnerState }, styles) {
        return [styles.content, ownerState.contentHidden && styles.contentHidden];
    },
})<{ ownerState: OwnerState }>(
    ({ ownerState }) => css`
        ${ownerState.contentHidden &&
        css`
            display: "none";
        `}
    `,
);

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

type TabsChild = React.ReactElement<TabProps> | boolean | null | undefined;
type TabsChildren = TabsChild | Array<TabsChild | Array<TabsChild>>;

export interface TabsProps
    extends MuiTabsProps,
        ThemedComponentBaseProps<{
            root: "div";
            tabs: typeof MuiTabs;
            content: "div";
        }> {
    children: TabsChildren;
    tabComponent?: React.ComponentType<MuiTabProps>;
    defaultIndex?: number;
    tabsState?: ITabsState;
}

export function Tabs(inProps: TabsProps) {
    const {
        children,
        tabComponent: TabComponent = MuiTab,
        defaultIndex,
        tabsState,
        ScrollButtonComponent = TabScrollButton,
        slotProps,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminTabs" });

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
        <Root {...slotProps?.root}>
            <StyledTabs
                value={value}
                onChange={handleChange}
                ScrollButtonComponent={ScrollButtonComponent}
                scrollButtons="auto"
                variant="scrollable"
                {...slotProps?.tabs}
                {...restProps}
            >
                {React.Children.map(children, (child: React.ReactElement<TabProps>) => {
                    if (!React.isValidElement<TabProps>(child)) {
                        return null;
                    }

                    const { children, label, ...restTabProps } = child.props;
                    return <TabComponent label={label} {...restTabProps} />;
                })}
            </StyledTabs>
            {React.Children.map(children, (child: React.ReactElement<TabProps>, index) => {
                const ownerState: OwnerState = {
                    contentHidden: index !== value && child.props.forceRender,
                };

                if (!React.isValidElement<TabProps>(child)) {
                    return null;
                }

                if (index === value || child.props.forceRender) {
                    return (
                        <Content ownerState={ownerState} {...slotProps?.content}>
                            {child.props.children}
                        </Content>
                    );
                }
            })}
        </Root>
    );
}

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

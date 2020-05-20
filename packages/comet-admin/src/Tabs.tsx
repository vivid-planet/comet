import MaterialAppBar, { AppBarProps } from "@material-ui/core/AppBar";
import MaterialTab, { TabProps } from "@material-ui/core/Tab";
import MuiTabs, { TabsProps } from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import styled from "styled-components";

interface ITabProps extends TabProps {
    label: string;
    tabLabel?: React.ReactNode;
    children: React.ReactNode;
}
export const Tab: React.SFC<ITabProps> = () => null;

function TabContainer(props: any) {
    return (
        <Typography component="div" style={{ ...(props.style || {}) }}>
            {props.children}
        </Typography>
    );
}

const Root = styled.div`
    flex-grow: 1;
`;

interface IProps {
    children: Array<React.ReactElement<ITabProps>> | React.ReactElement<ITabProps>;
    variant?: TabsProps["variant"];
    indicatorColor?: TabsProps["indicatorColor"];
    appBarComponent?: React.ComponentType<AppBarProps>;
    tabComponent?: React.ComponentType<TabProps>;
    defaultIndex?: number;
    onChange?: (value: number) => void;
}

export function Tabs(props: IProps) {
    const { variant, indicatorColor, appBarComponent: AppBar = MaterialAppBar, tabComponent: TabComponent = MaterialTab } = props;

    const [value, setValue] = React.useState(props.defaultIndex !== undefined ? props.defaultIndex : 0);
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);

        if (props.onChange) {
            props.onChange(newValue);
        }
    };

    React.Children.forEach(props.children, (child: React.ReactElement<ITabProps>) => {
        if (child.type !== Tab) {
            throw new Error("RouterTabs must contain only Tab children");
        }
    });

    return (
        <Root>
            <AppBar position="static">
                <MuiTabs value={value} onChange={handleChange} variant={variant} indicatorColor={indicatorColor}>
                    {React.Children.map(props.children, (child: React.ReactElement<ITabProps>) => {
                        const { children, label, tabLabel, ...restTabProps } = child.props;
                        return <TabComponent label={tabLabel ? tabLabel : label} {...restTabProps} />;
                    })}
                </MuiTabs>
            </AppBar>
            {React.Children.map(props.children, (child: React.ReactElement<ITabProps>, index) => {
                if (index === value) {
                    return <TabContainer>{child.props.children}</TabContainer>;
                }
            })}
        </Root>
    );
}

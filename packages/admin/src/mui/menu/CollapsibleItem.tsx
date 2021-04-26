import { Collapse, List } from "@material-ui/core";
import { ListProps } from "@material-ui/core/List";
import ArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import ArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import * as React from "react";

import { IMenuItemProps, MenuItem } from "./Item";

export interface IMenuLevel {
    level?: number;
}

type MenuChild = React.ReactElement<IMenuLevel>;

export interface ICollapsibleItemProps extends IMenuItemProps {
    children: MenuChild[];
    collapsible: boolean;
    secondaryAction?: React.ComponentType<ICollapsibleItemSecondaryActionProps>;
    isOpen?: boolean;
    text: React.ReactNode;
}

export interface ICollapsibleItemSecondaryActionProps {
    open: boolean;
}

export const DefaultSecondaryAction: React.FC<ICollapsibleItemSecondaryActionProps> = ({ open }) => {
    return open ? <ArrowUpIcon /> : <ArrowDownIcon />;
};

export const MenuCollapsibleItem: React.FunctionComponent<ICollapsibleItemProps & ListProps> = ({
    level,
    collapsible,
    isOpen,
    text,
    icon,
    children,
    secondaryAction: SecondaryAction = DefaultSecondaryAction,
    ...otherProps
}) => {
    if (!level) level = 1;
    const [open, setOpen] = React.useState(isOpen !== undefined ? isOpen : true);
    const childElements = React.Children.map(children, (child: MenuChild) =>
        React.cloneElement<IMenuLevel>(child, {
            level: level! + 1,
        }),
    );

    return (
        <List {...otherProps} disablePadding={true}>
            <MenuItem
                {...{ text, icon, level }}
                onClick={handleClick.bind(null, open, setOpen)}
                secondaryAction={collapsible && <SecondaryAction open={open} />}
            />
            {collapsible ? (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    {childElements}
                </Collapse>
            ) : (
                childElements
            )}
        </List>
    );
};

const handleClick = (open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
    setOpen(!open);
};

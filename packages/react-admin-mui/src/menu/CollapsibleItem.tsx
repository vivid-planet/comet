import { Collapse, List } from "@material-ui/core";
import { ListProps } from "@material-ui/core/List";
import { KeyboardArrowDown as ArrowDownIcon, KeyboardArrowUp as ArrowUpIcon } from "@material-ui/icons";
import * as React from "react";
import * as sc from "./CollapsibleItem.sc";
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
}

export interface ICollapsibleItemSecondaryActionProps {
    open: boolean;
}

export const DefaultSecondaryAction: React.FC<ICollapsibleItemSecondaryActionProps> = ({ open }) => (
    <sc.ArrowWrapper>{open ? <ArrowUpIcon /> : <ArrowDownIcon />}</sc.ArrowWrapper>
);

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

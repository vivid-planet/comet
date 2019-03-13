import { Collapse, IconButton, List } from "@material-ui/core";
import { ListProps } from "@material-ui/core/List";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import ArrowDropUp from "@material-ui/icons/ArrowDropUp";
import { IMenuItemProps, MenuItem } from "@vivid-planet/react-admin-mui";
import * as React from "react";

export interface IMenuLevel {
    level?: number;
}

type MenuChild = React.ReactElement<IMenuLevel>;

export interface ICollapsibleItemProps extends IMenuItemProps {
    children: MenuChild[];
    collapsible: boolean;
}

const SecondaryAction = ({ open, onClick }: any) => {
    return <IconButton onClick={onClick}>{open ? <ArrowDropDown /> : <ArrowDropUp />}</IconButton>;
};

const CollapsibleItem: React.FunctionComponent<ICollapsibleItemProps & ListProps> = ({ level, collapsible, text, icon, children, ...otherProps }) => {
    if (!level) level = 1;
    const [open, setOpen] = React.useState(true);
    const childElements = React.Children.map(children, (child: MenuChild) =>
        React.cloneElement<IMenuLevel>(child, {
            level: level! + 1,
        }),
    );

    return (
        <List {...otherProps} disablePadding={true}>
            <MenuItem
                {...{ text, icon, level }}
                secondaryAction={collapsible && <SecondaryAction open={open} onClick={handleClick.bind(null, open, setOpen)} />}
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

export default CollapsibleItem;

const handleClick = (open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
    setOpen(!open);
};

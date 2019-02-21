import { Collapse, IconButton, List } from "@material-ui/core";
import { ListProps } from "@material-ui/core/List";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { IMenuItemProps, MenuItem } from "@vivid-planet/react-admin-mui";
import * as React from "react";

export interface IMenuLevel {
    level?: number;
}

export interface ICollapsibleItemProps extends IMenuItemProps {
    collapsible: boolean;
}

const SecondaryAction = ({ open, onClick }: any) => {
    return <IconButton onClick={onClick}>{open ? <ExpandLess /> : <ExpandMore />}</IconButton>;
};

const CollapsibleItem: React.FunctionComponent<ICollapsibleItemProps & ListProps> = ({ level, collapsible, text, icon, children, ...otherProps }) => {
    if (!level) level = 1;
    const [open, setOpen] = React.useState(true);
    const childElements = React.Children.map(children, (child: React.ReactElement<IMenuLevel>) =>
        React.cloneElement<IMenuLevel>(child, {
            level: level! + 1,
        }),
    );

    return (
        <List {...otherProps}>
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

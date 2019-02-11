import { Collapse, Icon, ListItem as MuiListItem, ListItemIcon, ListItemText, Theme } from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";
import { List } from "@vivid-planet/react-admin-mui";
import * as React from "react";
import { Link } from "react-router-dom";

export interface IListItemState {
    open: boolean;
}

export interface IListItem {
    text: string;
    icon?: React.ComponentType;
    path?: string;
    children?: IListItem[];
}

export interface IListItemProps {
    level: number;
    showIconsOnly: boolean;
}

class ListItem extends React.Component<IListItem & IListItemProps & WithStyles<typeof styles, true>, IListItemState> {
    public readonly state: IListItemState = {
        open: true,
    };

    public render() {
        const { text, icon, path, children, level, showIconsOnly, classes } = this.props;
        const { open } = this.state;

        return (
            <>
                <MuiListItem
                    className={classes.listItem}
                    button
                    onClick={this.handleClick}
                    {...{ level }}
                    {...(path ? { selected: location.pathname === path, component: Link, to: path } : {})}
                >
                    <ListItemIcon>{!!icon ? React.createElement(icon) : <Icon>{text.substr(0, 1)}</Icon>}</ListItemIcon>
                    <ListItemText primary={text} primaryTypographyProps={{ noWrap: true }} />
                    {!!children && (open ? <ExpandLess /> : <ExpandMore />)}
                </MuiListItem>
                {!!children && (
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List items={children} level={level + 1} showIconsOnly={showIconsOnly} disablePadding />
                    </Collapse>
                )}
            </>
        );
    }

    private handleClick = () => {
        if (this.props.showIconsOnly) return false;
        this.setState(state => ({ open: !state.open }));
    };
}

const styles = (theme: Theme) =>
    createStyles({
        // @ts-ignore
        listItem: {
            paddingLeft: ({ level, showIconsOnly }: IListItem & IListItemProps) => theme.spacing.unit * 2 * (showIconsOnly ? 1 : level),
        },
    });

export default withStyles(styles, { withTheme: true })(ListItem);

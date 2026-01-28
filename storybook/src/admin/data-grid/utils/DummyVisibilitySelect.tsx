import { ChevronDown, Invisible, Visible } from "@comet/admin-icons";
import { Chip, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

export const DummyVisibilitySelect = () => {
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const [visible, setVisible] = useState(true);

    const handleMenuItemClick = (visible: boolean) => {
        setVisible(visible);
        setAnchorEl(null);
    };

    return (
        <>
            <Chip
                component="button"
                aria-label="Select visibility"
                color={visible ? "success" : "default"}
                icon={<ChevronDown />}
                label={visible ? "Visible" : "Invisible"}
                onClick={(event) => setAnchorEl(event.currentTarget)}
            />
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem onClick={() => handleMenuItemClick(true)}>
                    <ListItemIcon>
                        <Visible />
                    </ListItemIcon>
                    <ListItemText primary="Visible" />
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick(false)}>
                    <ListItemIcon>
                        <Invisible />
                    </ListItemIcon>
                    <ListItemText primary="Invisible" />
                </MenuItem>
            </Menu>
        </>
    );
};

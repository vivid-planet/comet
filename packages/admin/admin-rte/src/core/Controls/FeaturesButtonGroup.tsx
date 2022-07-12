import { MoreHoriz } from "@mui/icons-material";
import { ComponentsOverrides, ListItemIcon, Menu, MenuItem, Theme, Tooltip } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import { Editor } from "draft-js";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { IFeatureConfig } from "../types";
import ControlButton from "./ControlButton";

interface IProps {
    features: IFeatureConfig[];
    disabled?: boolean;
    editorRef: React.RefObject<Editor>;
    maxVisible?: number;
}

function FeaturesButtonGroup({ features, disabled: globallyDisabled, classes, editorRef, maxVisible }: IProps & WithStyles<typeof styles>) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMoreOptionsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);

        setTimeout(() => {
            if (editorRef.current) {
                editorRef.current.focus();
            }
        }, 0);
    };

    if (!features.length) {
        return null;
    }

    const visibleFeatures = maxVisible === undefined ? features : features.slice(0, maxVisible);
    const additionalFeatures = maxVisible === undefined ? [] : features.slice(maxVisible);

    return (
        <div className={classes.root}>
            {visibleFeatures.map(({ name, onButtonClick, tooltipText, disabled, ...rest }) => (
                <div className={classes.buttonWrapper} key={name}>
                    {tooltipText ? (
                        <Tooltip title={tooltipText} placement="top">
                            <span>
                                <ControlButton onButtonClick={onButtonClick} disabled={globallyDisabled || disabled} {...rest} />
                            </span>
                        </Tooltip>
                    ) : (
                        <ControlButton onButtonClick={onButtonClick} disabled={globallyDisabled || disabled} {...rest} />
                    )}
                </div>
            ))}
            {additionalFeatures.length > 0 && (
                <>
                    <div className={classes.buttonWrapper}>
                        <Tooltip
                            title={<FormattedMessage id="cometAdmin.rte.controls.moreOptionsTooltip" defaultMessage="More options" />}
                            placement="top"
                        >
                            <span>
                                <ControlButton onButtonClick={handleMoreOptionsClick} disabled={globallyDisabled} icon={MoreHoriz} />
                            </span>
                        </Tooltip>
                    </div>
                    <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleMenuClose}>
                        {additionalFeatures.map(({ name, onButtonClick, disabled, selected, label, icon: Icon }) => (
                            <MenuItem
                                key={name}
                                onMouseDown={(event) => {
                                    handleMenuClose();

                                    // See https://reactjs.org/docs/legacy-event-pooling.html for more information.
                                    event.persist();
                                    setTimeout(() => {
                                        onButtonClick?.(event);
                                    }, 0);
                                }}
                                disabled={globallyDisabled || disabled}
                                selected={selected}
                                className={classes.listItem}
                            >
                                {label}
                                {Icon && (
                                    <ListItemIcon className={classes.listItemIcon}>
                                        <Icon />
                                    </ListItemIcon>
                                )}
                            </MenuItem>
                        ))}
                    </Menu>
                </>
            )}
        </div>
    );
}

export type RteFeaturesButtonGroupClassKey = "root" | "buttonWrapper" | "listItem" | "listItemIcon";

const styles = () => {
    return createStyles<RteFeaturesButtonGroupClassKey, IProps>({
        root: {
            display: "inline-flex",
            justifyContent: "flex-start",
        },
        buttonWrapper: {
            marginRight: 1,
            "&:last-child": {
                marginRight: 0,
            },
        },
        listItem: {
            justifyContent: "space-between",
        },
        listItemIcon: {
            justifyContent: "flex-end",
        },
    });
};

export default withStyles(styles, { name: "CometAdminRteFeaturesButtonGroup" })(FeaturesButtonGroup);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminRteFeaturesButtonGroup: RteFeaturesButtonGroupClassKey;
    }

    interface Components {
        CometAdminRteFeaturesButtonGroup?: {
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminRteFeaturesButtonGroup"];
        };
    }
}

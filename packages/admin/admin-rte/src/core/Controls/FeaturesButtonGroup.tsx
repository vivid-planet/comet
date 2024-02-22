import { ThemedComponentBaseProps } from "@comet/admin";
import { MoreHoriz } from "@mui/icons-material";
import { ListItemIcon as MuiListItemIcon, Menu, MenuItem, Tooltip } from "@mui/material";
import { ComponentsOverrides, css, styled, Theme, useThemeProps } from "@mui/material/styles";
import { Editor } from "draft-js";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { IFeatureConfig } from "../types";
import { ControlButton } from "./ControlButton";

interface IProps
    extends ThemedComponentBaseProps<{ root: "div"; buttonWrapper: "div"; listItem: typeof MenuItem; listItemIcon: typeof MuiListItemIcon }> {
    features: IFeatureConfig[];
    disabled?: boolean;
    editorRef: React.RefObject<Editor>;
    maxVisible?: number;
}

export function FeaturesButtonGroup(inProps: IProps) {
    const {
        features,
        disabled: globallyDisabled,
        editorRef,
        maxVisible,
        slotProps,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminRteFeaturesButtonGroup" });
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

    // Ensures that the dropdown never contains only one feature and that maximum {maxVisible} buttons are shown
    // If maxVisible = 4 and there are four features -> all four features (and no dropdown) are shown
    // If maxVisible = 4 and there are five features -> three features and the dropdown (containing two features) are shown
    const visibleFeatures = maxVisible !== undefined && features.length > maxVisible ? features.slice(0, maxVisible - 1) : features;
    const additionalFeatures = maxVisible !== undefined && features.length > maxVisible ? features.slice(maxVisible - 1) : [];

    return (
        <Root {...slotProps?.root} {...restProps}>
            {visibleFeatures.map(({ name, onButtonClick, tooltipText, disabled, ...rest }) => (
                <ButtonWrapper {...slotProps?.buttonWrapper} key={name}>
                    {tooltipText ? (
                        <Tooltip title={tooltipText} placement="top">
                            <span>
                                <ControlButton onButtonClick={onButtonClick} disabled={globallyDisabled || disabled} {...rest} />
                            </span>
                        </Tooltip>
                    ) : (
                        <ControlButton onButtonClick={onButtonClick} disabled={globallyDisabled || disabled} {...rest} />
                    )}
                </ButtonWrapper>
            ))}
            {additionalFeatures.length > 0 && (
                <>
                    <ButtonWrapper {...slotProps?.buttonWrapper}>
                        <Tooltip
                            title={<FormattedMessage id="comet.rte.controls.moreOptionsTooltip" defaultMessage="More options" />}
                            placement="top"
                        >
                            <span>
                                <ControlButton onButtonClick={handleMoreOptionsClick} disabled={globallyDisabled} icon={MoreHoriz} />
                            </span>
                        </Tooltip>
                    </ButtonWrapper>
                    <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleMenuClose}>
                        {additionalFeatures.map(({ name, onButtonClick, disabled, selected, label, icon: Icon }) => (
                            <ListItem
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
                                {...slotProps?.listItem}
                            >
                                {label}
                                {Icon && (
                                    <ListItemIcon {...slotProps?.listItemIcon}>
                                        <Icon />
                                    </ListItemIcon>
                                )}
                            </ListItem>
                        ))}
                    </Menu>
                </>
            )}
        </Root>
    );
}

export type RteFeaturesButtonGroupClassKey = "root" | "buttonWrapper" | "listItem" | "listItemIcon";

const Root = styled("div", {
    name: "CometAdminRteFeaturesButtonGroup",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})(css`
    display: inline-flex;
    justify-content: flex-start;
`);

const ButtonWrapper = styled("div", {
    name: "CometAdminRteFeaturesButtonGroup",
    slot: "buttonWrapper",
    overridesResolver(_, styles) {
        return [styles.buttonWrapper];
    },
})(css`
    margin-right: 1px;
    &:last-child {
        margin-right: 0;
    }
`);

const ListItem = styled(MenuItem, {
    name: "CometAdminRteFeaturesButtonGroup",
    slot: "listItem",
    overridesResolver(_, styles) {
        return [styles.listItem];
    },
})(css`
    justify-content: space-between;
`);

const ListItemIcon = styled(MuiListItemIcon, {
    name: "CometAdminRteFeaturesButtonGroup",
    slot: "listItemIcon",
    overridesResolver(_, styles) {
        return [styles.listItemIcon];
    },
})(css`
    justify-content: flex-end;
`);

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

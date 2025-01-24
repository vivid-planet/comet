import { IconButton, IconButtonProps, TooltipProps } from "@mui/material";
import { forwardRef, ReactNode } from "react";

import { Tooltip } from "../common/Tooltip";
import { CommonRowActionItemProps } from "./RowActionsItem";

export interface RowActionsIconItemComponentsProps {
    tooltip?: Partial<TooltipProps>;
    iconButton?: Partial<IconButtonProps>;
}

export interface RowActionsIconItemProps extends CommonRowActionItemProps {
    componentsProps?: RowActionsIconItemComponentsProps;
    tooltip?: ReactNode;
}

export const RowActionsIconItem = forwardRef<HTMLButtonElement, RowActionsIconItemProps>(
    ({ icon, tooltip, componentsProps = {}, ...restIconButtonProps }, ref) => {
        const { tooltip: tooltipProps, iconButton: iconButtonProps } = componentsProps;

        const combinedIconButtonProps = { ...restIconButtonProps, ...iconButtonProps };
        const buttonIsDisabled = Boolean(combinedIconButtonProps.disabled);

        const button = (
            <IconButton {...combinedIconButtonProps} ref={ref}>
                {icon}
            </IconButton>
        );

        if (tooltip && !buttonIsDisabled) {
            return (
                <Tooltip title={tooltip} {...tooltipProps}>
                    {button}
                </Tooltip>
            );
        }

        return <>{button}</>;
    },
);

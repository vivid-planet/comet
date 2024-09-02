import { IconButton, IconButtonProps, Tooltip, TooltipProps } from "@mui/material";
import { forwardRef, ReactNode } from "react";

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
        const button = (
            <IconButton {...restIconButtonProps} {...iconButtonProps} ref={ref}>
                {icon}
            </IconButton>
        );

        if (tooltip) {
            return (
                <Tooltip title={tooltip} {...tooltipProps}>
                    {button}
                </Tooltip>
            );
        }

        return <>{button}</>;
    },
);

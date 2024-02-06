// eslint-disable-next-line no-restricted-imports
import { Badge as MuiBadge, BadgeProps as MuiBadgeProps } from "@mui/material";
import * as React from "react";

export type BadgeProps = MuiBadgeProps;

const Badge: React.ForwardRefExoticComponent<React.PropsWithChildren<BadgeProps>> = React.forwardRef(({ children, ...props }, ref) => {
    return (
        <MuiBadge
            ref={ref}
            {...props}
            sx={
                !children
                    ? {
                          position: "static",
                          "& span": {
                              transform: "none",
                              position: "static",
                          },
                      }
                    : undefined
            }
        >
            {children}
        </MuiBadge>
    );
});

export { Badge };

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminBadge: BadgeProps;
    }

    interface Components {
        CometAdminBadge?: {
            defaultProps?: ComponentsPropsList["CometAdminBadge"];
        };
    }
}

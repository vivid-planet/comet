// eslint-disable-next-line no-restricted-imports
import { Badge as MuiBadge, BadgeProps as MuiBadgeProps } from "@mui/material";
import * as React from "react";

const Badge: React.ForwardRefExoticComponent<React.PropsWithChildren<MuiBadgeProps>> = React.forwardRef(({ children, ...props }, ref) => {
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

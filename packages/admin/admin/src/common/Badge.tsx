// eslint-disable-next-line no-restricted-imports
import { Badge as MuiBadge, BadgeProps as MuiBadgeProps } from "@mui/material";
import * as React from "react";

const Badge: React.ForwardRefExoticComponent<React.PropsWithChildren<MuiBadgeProps>> = React.forwardRef(({ children, ...props }, ref) => {
    return (
        <MuiBadge
            ref={ref}
            {...props}
            slotProps={
                !children
                    ? {
                          // @ts-expect-error `sx` props is missing in types of `slotProps.root`
                          root: { sx: { position: "static" } },
                          badge: { sx: { transform: "none", position: "static" } },
                      }
                    : undefined
            }
        >
            {children}
        </MuiBadge>
    );
});

export { Badge };

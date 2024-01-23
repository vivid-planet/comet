import { ChevronDown, ChevronUp } from "@comet/admin-icons";
import { ComponentsOverrides, Popover, PopoverProps, Theme, useTheme } from "@mui/material";
import { css, styled, useThemeProps } from "@mui/material/styles";
import * as React from "react";

import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { AppHeaderButton, AppHeaderButtonProps } from "../button/AppHeaderButton";

export type AppHeaderDropdownClassKey = "root" | "popoverRoot";

export interface AppHeaderDropdownProps
    extends Omit<AppHeaderButtonProps, "children">,
        ThemedComponentBaseProps<{
            root: "div";
            popoverRoot: typeof Popover;
        }> {
    children?: ((closeDropdown: () => void) => React.ReactNode) | React.ReactNode;
    buttonChildren?: React.ReactNode;
    dropdownArrow?: ((isOpen: boolean) => React.ReactNode) | null;
    popoverProps?: Partial<PopoverProps>;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const Root = styled("div", {
    name: "CometAdminAppHeaderDropdown",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})(
    css`
        height: 100%;
    `,
);

const PopoverRoot = styled(Popover, {
    name: "CometAdminAppHeaderDropdown",
    slot: "popoverRoot",
    overridesResolver(_, styles) {
        return [styles.popoverRoot];
    },
})();

function DefaultArrowUp(): React.ReactElement {
    const { palette } = useTheme();
    return <ChevronUp htmlColor={palette.primary.contrastText} />;
}

function DefaultArrowDown(): React.ReactElement {
    const { palette } = useTheme();
    return <ChevronDown htmlColor={palette.primary.contrastText} />;
}

export function AppHeaderDropdown(inProps: AppHeaderDropdownProps) {
    const {
        children,
        buttonChildren,
        dropdownArrow = (isOpen: boolean) => (isOpen ? <DefaultArrowUp /> : <DefaultArrowDown />),
        popoverProps,
        open,
        onOpenChange,
        classes,
        slotProps,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminAppHeaderDropdown" });

    const [uncontrolledOpen, setUncontrolledOpen] = React.useState<boolean>(false);

    const _open = open !== undefined ? open : uncontrolledOpen;
    const _onOpenChange =
        onOpenChange !== undefined
            ? onOpenChange
            : (open: boolean) => {
                  setUncontrolledOpen(open);
              };

    const [itemWidth, setItemWidth] = React.useState<number>(0);
    const rootRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (rootRef.current) {
            setItemWidth(rootRef.current.clientWidth);
        }
    }, []);

    return (
        <Root ref={rootRef} {...slotProps?.root}>
            <AppHeaderButton endIcon={dropdownArrow !== null ? dropdownArrow(_open) : undefined} {...restProps} onClick={() => _onOpenChange(true)}>
                {buttonChildren}
            </AppHeaderButton>
            <PopoverRoot
                {...slotProps?.popoverRoot}
                open={_open}
                anchorEl={rootRef.current}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={() => _onOpenChange(false)}
                marginThreshold={0}
                PaperProps={{
                    sx: {
                        minWidth: itemWidth,
                    },
                }}
                {...popoverProps}
            >
                {typeof children === "function" ? children(() => _onOpenChange(false)) : children}
            </PopoverRoot>
        </Root>
    );
}

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminAppHeaderDropdown: Partial<AppHeaderDropdownProps>;
    }

    interface ComponentNameToClassKey {
        CometAdminAppHeaderDropdown: AppHeaderDropdownClassKey;
    }

    interface Components {
        CometAdminAppHeaderDropdown?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminAppHeaderDropdown"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminAppHeaderDropdown"];
        };
    }
}

import { ChevronDown, ChevronUp } from "@comet/admin-icons";
import { ComponentsOverrides, Popover as MuiPopover, PopoverProps, Theme } from "@mui/material";
import { css, useThemeProps } from "@mui/material/styles";
import * as React from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { AppHeaderButton, AppHeaderButtonProps } from "../button/AppHeaderButton";

export type AppHeaderDropdownClassKey = "root" | "popover" | "button";

export interface AppHeaderDropdownProps
    extends Omit<AppHeaderButtonProps, "children" | "slotProps">,
        ThemedComponentBaseProps<{
            root: "div";
            popover: typeof Popover;
            button: typeof AppHeaderButton;
        }> {
    children?: ((closeDropdown: () => void) => React.ReactNode) | React.ReactNode;
    buttonChildren?: React.ReactNode;
    dropdownArrow?: ((isOpen: boolean) => React.ReactNode) | null;
    popoverProps?: Partial<PopoverProps>;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const Root = createComponentSlot("div")<AppHeaderDropdownClassKey>({
    componentName: "AppHeaderDropdown",
    slotName: "root",
})(css`
    height: 100%;
`);

const Button = createComponentSlot(AppHeaderButton)<AppHeaderDropdownClassKey>({
    componentName: "AppHeaderDropdown",
    slotName: "button",
})();

const Popover = createComponentSlot(MuiPopover)<AppHeaderDropdownClassKey>({
    componentName: "AppHeaderDropdown",
    slotName: "popover",
})();

export function AppHeaderDropdown(inProps: AppHeaderDropdownProps) {
    const {
        children,
        buttonChildren,
        dropdownArrow = (isOpen: boolean) => (isOpen ? <ChevronUp /> : <ChevronDown />),
        open,
        onOpenChange,
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
            <Button
                endIcon={dropdownArrow !== null ? dropdownArrow(_open) : undefined}
                {...restProps}
                {...slotProps?.button}
                onClick={() => _onOpenChange(true)}
            >
                {buttonChildren}
            </Button>
            <Popover
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
                {...slotProps?.popover}
            >
                {typeof children === "function" ? children(() => _onOpenChange(false)) : children}
            </Popover>
        </Root>
    );
}

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminAppHeaderDropdown: AppHeaderDropdownProps;
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

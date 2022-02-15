import { ChevronDown, ChevronUp } from "@comet/admin-icons";
import { Popover, PopoverProps, useTheme } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

import { AppHeaderButton, AppHeaderButtonProps } from "../button/AppHeaderButton";

export type AppHeaderDropdownClassKey = "root" | "popoverRoot" | "popoverPaper";

export interface AppHeaderDropdownProps extends Omit<AppHeaderButtonProps, "children"> {
    children?: ((closeDropdown: () => void) => React.ReactNode) | React.ReactNode;
    buttonChildren?: React.ReactNode;
    dropdownArrow?: ((isOpen: boolean) => React.ReactNode) | null;
    popoverProps?: Partial<PopoverProps>;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const styles = () => {
    return createStyles<AppHeaderDropdownClassKey, AppHeaderDropdownProps>({
        root: {
            height: "100%",
        },
        popoverRoot: {},
        popoverPaper: {
            minWidth: "var(--comet-admin-app-header-dropdown-item-width)",
        },
    });
};

function DefaultArrowUp(): React.ReactElement {
    const { palette } = useTheme();
    return <ChevronUp htmlColor={palette.primary.contrastText} />;
}

function DefaultArrowDown(): React.ReactElement {
    const { palette } = useTheme();
    return <ChevronDown htmlColor={palette.primary.contrastText} />;
}

function Dropdown({
    children,
    buttonChildren,
    dropdownArrow = (isOpen) => (isOpen ? <DefaultArrowUp /> : <DefaultArrowDown />),
    popoverProps,
    open,
    onOpenChange,
    classes,
    ...restProps
}: AppHeaderDropdownProps & WithStyles<typeof styles>): React.ReactElement {
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
        <div className={classes.root} ref={rootRef}>
            <AppHeaderButton endIcon={dropdownArrow !== null ? dropdownArrow(_open) : undefined} {...restProps} onClick={() => _onOpenChange(true)}>
                {buttonChildren}
            </AppHeaderButton>
            <Popover
                classes={{ root: classes.popoverRoot, paper: classes.popoverPaper }}
                style={{ "--comet-admin-app-header-dropdown-item-width": `${itemWidth}px` } as React.CSSProperties}
                open={_open}
                anchorEl={rootRef.current}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={() => _onOpenChange(false)}
                marginThreshold={0}
                {...popoverProps}
            >
                {typeof children === "function" ? children(() => _onOpenChange(false)) : children}
            </Popover>
        </div>
    );
}

export const AppHeaderDropdown = withStyles(styles, { name: "CometAdminAppHeaderDropdown" })(Dropdown);

declare module "@mui/material/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminAppHeaderDropdown: AppHeaderDropdownClassKey;
    }
}

declare module "@mui/material/styles/props" {
    interface ComponentsPropsList {
        CometAdminAppHeaderDropdown: AppHeaderDropdownProps;
    }
}

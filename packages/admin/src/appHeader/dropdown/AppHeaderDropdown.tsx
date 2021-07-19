import { ChevronDown, ChevronUp } from "@comet/admin-icons";
import { Popover, useTheme } from "@material-ui/core";
import { PopoverProps } from "@material-ui/core/Popover/Popover";
import { StyledComponentProps } from "@material-ui/core/styles";
import * as React from "react";

import { mergeClasses } from "../../helpers/mergeClasses";
import { AppHeaderButton, AppHeaderButtonProps } from "../button/AppHeaderButton";
import { CometAdminAppHeaderDropdownClassKeys, useStyles } from "./AppHeaderDropdown.styles";

interface Props extends AppHeaderButtonProps {
    children?: ((closeDropdown: () => void) => React.ReactNode) | React.ReactNode;
    buttonChildren?: React.ReactNode;
    dropdownArrow?: ((isOpen: boolean) => React.ReactNode) | null;
    popoverProps?: Partial<PopoverProps>;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

function DefaultArrowUp(): React.ReactElement {
    const { palette } = useTheme();
    return <ChevronUp htmlColor={palette.primary.contrastText} />;
}

function DefaultArrowDown(): React.ReactElement {
    const { palette } = useTheme();
    return <ChevronDown htmlColor={palette.primary.contrastText} />;
}

export function AppHeaderDropdown({
    children,
    buttonChildren,
    dropdownArrow = (isOpen) => (isOpen ? <DefaultArrowUp /> : <DefaultArrowDown />),
    popoverProps,
    open,
    onOpenChange,
    classes: passedClasses,
    ...restProps
}: Props & StyledComponentProps<CometAdminAppHeaderDropdownClassKeys>): React.ReactElement {
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
    const classes = mergeClasses<CometAdminAppHeaderDropdownClassKeys>(useStyles({ itemWidth }), passedClasses);

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
                open={_open}
                anchorEl={rootRef.current}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                onBackdropClick={() => _onOpenChange(false)}
                marginThreshold={0}
                {...popoverProps}
            >
                {typeof children === "function" ? children(() => _onOpenChange(false)) : children}
            </Popover>
        </div>
    );
}

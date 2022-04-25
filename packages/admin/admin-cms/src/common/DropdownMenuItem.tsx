import { ChevronDown, ChevronUp } from "@comet/admin-icons";
import { ClickAwayListener, Grow, Paper, useTheme } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";

import * as sc from "./DropdownMenuItem.sc";

interface DropdownMenuItemProps {
    children: React.ReactElement;
    buttonText?: string;
    buttonIcon?: React.ReactNode;
    disableArrow?: boolean;
    scrollable?: boolean;
    customShowDropdownState?: [boolean, Dispatch<SetStateAction<boolean>>];
    disabled?: boolean;
}

export function DropdownMenuItem({
    children,
    buttonIcon,
    buttonText,
    disableArrow = false,
    scrollable = false,
    customShowDropdownState,
    disabled,
}: DropdownMenuItemProps): React.ReactElement {
    const defaultShowDropdownState = React.useState<boolean>(false);

    let showDropdown = defaultShowDropdownState[0];
    let setShowDropdown = defaultShowDropdownState[1];

    if (customShowDropdownState !== undefined) {
        showDropdown = customShowDropdownState[0];
        setShowDropdown = customShowDropdownState[1];
    }

    const theme = useTheme();
    const anchorRef = React.useRef<HTMLDivElement>(null);

    const DropdownContainer = scrollable ? sc.ScrollablePaper : Paper;

    return (
        <sc.Root ref={anchorRef}>
            <sc.Button open={showDropdown} onClick={() => setShowDropdown(!showDropdown)} disabled={disabled}>
                {buttonText ? (
                    <>
                        {buttonIcon && <sc.ButtonIconWrapperWithSpacing>{buttonIcon}</sc.ButtonIconWrapperWithSpacing>}
                        <sc.ButtonText>{buttonText}</sc.ButtonText>
                    </>
                ) : (
                    buttonIcon
                )}
                {!disableArrow && (
                    <sc.ArrowWrapper>
                        {showDropdown ? (
                            <ChevronUp htmlColor={theme.palette.primary.contrastText} />
                        ) : (
                            <ChevronDown htmlColor={theme.palette.primary.contrastText} />
                        )}
                    </sc.ArrowWrapper>
                )}
            </sc.Button>
            <sc.Popper open={showDropdown} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                    <Grow {...TransitionProps} style={{ transformOrigin: placement === "bottom" ? "center top" : "center bottom" }}>
                        <DropdownContainer>
                            <ClickAwayListener onClickAway={() => setShowDropdown(false)}>{children}</ClickAwayListener>
                        </DropdownContainer>
                    </Grow>
                )}
            </sc.Popper>
        </sc.Root>
    );
}

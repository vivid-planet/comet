import { Button, ButtonGroup, ButtonGroupProps, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from "@material-ui/core";
import * as React from "react";
import { PropsWithChildren } from "react";

import { useStoredState } from "../../../hooks/useStoredState";
import { useThemeProps } from "./SplitButton.styles";

export interface SplitButtonProps extends ButtonGroupProps<any> {
    selectedIndex?: number;
    onSelectIndex?: (index: number, item: React.ReactElement) => void;
    showSelectButton?: boolean;
    localStorageKey?: string;
    storage?: Storage;
}

// Based on https://material-ui.com/components/button-group/#split-button

export const SplitButton = ({
    selectedIndex,
    onSelectIndex,
    children,
    showSelectButton,
    localStorageKey,
    storage,
    ...restProps
}: PropsWithChildren<SplitButtonProps>) => {
    const childrenArray = React.Children.toArray(children);
    const themeProps = useThemeProps();
    const [uncontrolledSelectedIndex, setUncontrolledIndex] = useStoredState<number>(localStorageKey || false, 0, storage);
    const _selectedIndex = selectedIndex ?? uncontrolledSelectedIndex;
    const _onSelectIndex = onSelectIndex
        ? onSelectIndex
        : (index: number) => {
              setUncontrolledIndex(index);
          };

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);

    const handleMenuItemClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number, child: React.ReactElement) => {
        _onSelectIndex(index, child);
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }

        setOpen(false);
    };

    if (!React.isValidElement(childrenArray[_selectedIndex])) {
        return null;
    }

    const ActiveChild = childrenArray[_selectedIndex] as React.ReactElement;

    const { variant: activeChildVariant, color: activeChildColor } = ActiveChild.props;

    return (
        <>
            <ButtonGroup variant={activeChildVariant} color={activeChildColor} {...restProps} ref={anchorRef}>
                {ActiveChild}
                {(showSelectButton ?? childrenArray.length > 1) && (
                    <Button
                        variant={activeChildVariant}
                        color={activeChildColor}
                        size="small"
                        classes={ActiveChild.props.classes}
                        onClick={handleToggle}
                    >
                        {themeProps.selectIcon}
                    </Button>
                )}
            </ButtonGroup>
            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal style={{ zIndex: 1200 }}>
                {({ TransitionProps, placement }) => (
                    <Paper>
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                            }}
                        >
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList>
                                    {childrenArray.map((child: React.ReactElement, index) => {
                                        return (
                                            <MenuItem
                                                key={index}
                                                selected={index === selectedIndex}
                                                onClick={(event) => handleMenuItemClick(event, index, child)}
                                                disabled={child.props.disabled}
                                            >
                                                {child.props.children}
                                            </MenuItem>
                                        );
                                    })}
                                </MenuList>
                            </ClickAwayListener>
                        </Grow>
                    </Paper>
                )}
            </Popper>
        </>
    );
};

import { ChevronDown } from "@comet/admin-icons";
import { Button, ButtonGroup, ButtonGroupProps, MenuItem, MenuList, Popover } from "@mui/material";
import { withStyles } from "@mui/styles";
import * as React from "react";
import { PropsWithChildren } from "react";

import { useStoredState } from "../../../hooks/useStoredState";
import { SplitButtonContext } from "./SplitButtonContext";

export interface SplitButtonProps extends ButtonGroupProps<any> {
    selectIcon?: React.ReactNode;
    selectedIndex?: number;
    onSelectIndex?: (index: number, item: React.ReactElement) => void;
    showSelectButton?: boolean;
    localStorageKey?: string;
    autoClickOnSelect?: boolean;
    storage?: Storage;
}

// Based on https://v4.mui.com/components/button-group/#split-button
const SplitBtn = ({
    selectIcon = <ChevronDown />,
    selectedIndex,
    onSelectIndex,
    children,
    showSelectButton,
    localStorageKey,
    storage,
    autoClickOnSelect = true,
    ...restProps
}: PropsWithChildren<SplitButtonProps>) => {
    const [showSelectButtonState, setShowSelectButtonState] = React.useState<boolean | undefined>(undefined);

    const childrenArray = React.Children.toArray(children);
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
        if (autoClickOnSelect) {
            child?.props?.onClick();
        }
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

    const showSelect = showSelectButtonState != null ? showSelectButtonState : showSelectButton;
    return (
        <SplitButtonContext.Provider value={{ setShowSelectButton: setShowSelectButtonState }}>
            <ButtonGroup variant={activeChildVariant} color={activeChildColor} {...restProps} ref={anchorRef}>
                {ActiveChild}
                {(showSelect ?? childrenArray.length > 1) && (
                    <Button
                        variant={activeChildVariant}
                        color={activeChildColor}
                        size="small"
                        classes={ActiveChild.props.classes}
                        onClick={handleToggle}
                    >
                        {selectIcon}
                    </Button>
                )}
            </ButtonGroup>
            <Popover
                open={open}
                anchorEl={anchorRef.current}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={handleClose}
            >
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
            </Popover>
        </SplitButtonContext.Provider>
    );
};

export const SplitButton = withStyles({}, { name: "CometAdminSplitButton" })(SplitBtn);

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminSplitButton: SplitButtonProps;
    }

    interface Components {
        CometAdminSplitButton?: {
            defaultProps?: ComponentsPropsList["CometAdminSplitButton"];
        };
    }
}

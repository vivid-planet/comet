import { ChevronDown } from "@comet/admin-icons";
import {
    Button,
    ButtonGroup as MuiButtonGroup,
    ButtonGroupProps,
    MenuItem as MuiMenuItem,
    MenuList as MuiMenuList,
    Popover as MuiPopover,
    PopoverProps,
} from "@mui/material";
import { useThemeProps } from "@mui/material/styles";
import * as React from "react";
import { PropsWithChildren } from "react";

import { createComponentSlot } from "../../../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../../../helpers/ThemedComponentBaseProps";
import { useStoredState } from "../../../hooks/useStoredState";
import { SplitButtonContext } from "./SplitButtonContext";

/**
 * @deprecated Use a simple `SaveButton` instead as we are retiring the SplitButton pattern.
 */
export type SplitButtonClassKey = "root" | "activeButton" | "popover" | "menuList" | "menuItem";

/**
 * @deprecated Use a simple `SaveButton` instead as we are retiring the SplitButton pattern.
 */
export interface SplitButtonProps
    extends ButtonGroupProps<any>,
        ThemedComponentBaseProps<{
            root: typeof MuiButtonGroup;
            activeButton: typeof Button;
            popover: typeof MuiPopover;
            menuList: typeof MuiMenuList;
            menuItem: typeof MuiMenuItem;
        }> {
    selectIcon?: React.ReactNode;
    selectedIndex?: number;
    onSelectIndex?: (index: number, item: React.ReactElement) => void;
    showSelectButton?: boolean;
    localStorageKey?: string;
    autoClickOnSelect?: boolean;
    storage?: Storage;
    /**
     * @deprecated Use `slotProps` instead.
     */
    popoverProps?: Partial<PopoverProps>;
}

const Root = createComponentSlot(MuiButtonGroup)<SplitButtonClassKey>({
    componentName: "SplitButton",
    slotName: "root",
})();

const ActiveButton = createComponentSlot(Button)<SplitButtonClassKey>({
    componentName: "SplitButton",
    slotName: "activeButton",
})();

const Popover = createComponentSlot(MuiPopover)<SplitButtonClassKey>({
    componentName: "SplitButton",
    slotName: "popover",
})();

const MenuList = createComponentSlot(MuiMenuList)<SplitButtonClassKey>({
    componentName: "SplitButton",
    slotName: "menuList",
})();

const MenuItem = createComponentSlot(MuiMenuItem)<SplitButtonClassKey>({
    componentName: "SplitButton",
    slotName: "menuItem",
})();

// Based on https://v4.mui.com/components/button-group/#split-button
/**
 * @deprecated Use a simple `SaveButton` instead as we are retiring the SplitButton pattern.
 */
export function SplitButton(inProps: PropsWithChildren<SplitButtonProps>) {
    const {
        selectIcon = <ChevronDown />,
        selectedIndex,
        onSelectIndex,
        children,
        showSelectButton,
        localStorageKey,
        storage,
        autoClickOnSelect = true,
        popoverProps,
        slotProps,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminSplitButton" });

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
            <Root variant={activeChildVariant} color={activeChildColor} {...slotProps?.root} {...restProps} ref={anchorRef}>
                {ActiveChild}
                {(showSelect ?? childrenArray.length > 1) && (
                    <ActiveButton
                        variant={activeChildVariant}
                        color={activeChildColor}
                        size="small"
                        classes={ActiveChild.props.classes}
                        onClick={handleToggle}
                        {...slotProps?.activeButton}
                    >
                        {selectIcon}
                    </ActiveButton>
                )}
            </Root>
            <Popover
                open={open}
                anchorEl={anchorRef.current}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={handleClose}
                {...popoverProps}
                {...slotProps?.popover}
            >
                <MenuList {...slotProps?.menuList}>
                    {childrenArray.map((child: React.ReactElement, index) => {
                        return (
                            <MenuItem
                                key={index}
                                selected={index === selectedIndex}
                                onClick={(event) => handleMenuItemClick(event, index, child)}
                                disabled={child.props.disabled}
                                {...slotProps?.menuItem}
                            >
                                {child.props.children}
                            </MenuItem>
                        );
                    })}
                </MenuList>
            </Popover>
        </SplitButtonContext.Provider>
    );
}

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminSplitButton: SplitButtonProps;
    }

    interface Components {
        CometAdminSplitButton?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminSplitButton"]>;
        };
    }
}

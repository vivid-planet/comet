import { ChevronDown } from "@dextinity/admin-icons";
import { MenuItem, type MenuItemProps, MenuList, type MenuListProps, Popover, type PopoverProps } from "@mui/material";
import { css, styled } from "@mui/material/styles";
import {
    Children,
    cloneElement,
    type ComponentProps,
    isValidElement,
    type MouseEvent,
    type PropsWithChildren,
    type ReactElement,
    type ReactNode,
    useRef,
    useState,
} from "react";
import { useIntl } from "react-intl";

import { useStoredState } from "../../../hooks/useStoredState";
import { Button, type ButtonProps } from "../Button";
import { SplitButtonContext } from "./SplitButtonContext";

/**
 * @deprecated Use a simple `SaveButton` instead as we are retiring the SplitButton pattern.
 */
export type SplitButtonClassKey = "root" | "activeButton" | "popover" | "menuList" | "menuItem";

/**
 * @deprecated Use a simple `SaveButton` instead as we are retiring the SplitButton pattern.
 */
export interface SplitButtonProps {
    selectIcon?: ReactNode;
    selectedIndex?: number;
    onSelectIndex?: (index: number, item: ReactElement) => void;
    showSelectButton?: boolean;
    localStorageKey?: string;
    autoClickOnSelect?: boolean;
    storage?: Storage;
    /** Disables the active button and the button that opens the other options. */
    disabled?: boolean;
    className?: string;
    slotProps?: {
        root?: Partial<ComponentProps<"div">>;
        activeButton?: Partial<ButtonProps>;
        popover?: Partial<PopoverProps>;
        menuList?: Partial<MenuListProps>;
        menuItem?: Partial<MenuItemProps>;
    };
    /**
     * @deprecated Use `slotProps` instead.
     */
    popoverProps?: Partial<PopoverProps>;
    /** @deprecated Has no effect: the button that opens the other options takes the variant of the active button. */
    variant?: string;
    /** @deprecated Has no effect: the button that opens the other options takes the variant of the active button. */
    color?: string;
}

// Based on https://v4.mui.com/components/button-group/#split-button
/**
 * @deprecated Use a simple `SaveButton` instead as we are retiring the SplitButton pattern.
 */
export function SplitButton({
    selectIcon = <ChevronDown />,
    selectedIndex,
    onSelectIndex,
    children,
    showSelectButton,
    localStorageKey,
    storage,
    autoClickOnSelect = true,
    disabled,
    className,
    popoverProps,
    slotProps,
}: PropsWithChildren<SplitButtonProps>) {
    const intl = useIntl();
    const [showSelectButtonState, setShowSelectButtonState] = useState<boolean | undefined>(undefined);

    const childrenArray = Children.toArray(children);
    const [uncontrolledSelectedIndex, setUncontrolledIndex] = useStoredState<number>(localStorageKey || false, 0, storage);
    const _selectedIndex = selectedIndex ?? uncontrolledSelectedIndex;
    const _onSelectIndex = onSelectIndex
        ? onSelectIndex
        : (index: number) => {
              setUncontrolledIndex(index);
          };

    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);

    const handleMenuItemClick: (event: MouseEvent, index: number, child: ReactElement<any>) => void = (
        event: MouseEvent,
        index: number,
        child: ReactElement<any>,
    ) => {
        _onSelectIndex(index, child);
        setOpen(false);
        if (autoClickOnSelect) {
            child?.props?.onClick();
        }
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: MouseEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }

        setOpen(false);
    };

    if (!isValidElement(childrenArray[_selectedIndex])) {
        return null;
    }

    const ActiveChild = childrenArray[_selectedIndex] as ReactElement<any>;

    const { variant: activeChildVariant, size: activeChildSize } = ActiveChild.props;

    const showSelect = showSelectButtonState != null ? showSelectButtonState : showSelectButton;
    return (
        <SplitButtonContext.Provider value={{ setShowSelectButton: setShowSelectButtonState }}>
            <Root className={className} {...slotProps?.root} ref={anchorRef}>
                {disabled ? cloneElement(ActiveChild, { disabled: true }) : ActiveChild}
                {(showSelect ?? childrenArray.length > 1) && (
                    <SelectButton
                        variant={activeChildVariant}
                        size={activeChildSize}
                        disabled={disabled}
                        aria-label={intl.formatMessage({ id: "dextinity.splitButton.showOptions", defaultMessage: "Show options" })}
                        aria-haspopup="menu"
                        aria-expanded={open}
                        onClick={handleToggle}
                        {...slotProps?.activeButton}
                    >
                        {selectIcon}
                    </SelectButton>
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
                    {childrenArray.map((child: ReactElement<any>, index) => {
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

const Root = styled("div")(css`
    display: inline-flex;
    gap: 1px;

    & > .dextinityButton:not(:last-child) {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
    }

    & > .dextinityButton:not(:first-child) {
        border-start-start-radius: 0;
        border-end-start-radius: 0;
    }
`);

const SelectButton = styled(Button)(css`
    padding-inline: var(--dextinity-space-sm);
`);

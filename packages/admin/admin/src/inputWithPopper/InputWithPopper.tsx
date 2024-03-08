import { ClickAwayListener, Grow, InputBase as MuiInputBase, InputBaseProps, Paper as MuiPaper, Popper as MuiPopper } from "@mui/material";
import { useThemeProps } from "@mui/material/styles";
import { TransitionProps } from "@mui/material/transitions";
import * as React from "react";

import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";
import { InputBase, Paper, Popper, Root } from "./InputWithPopper.slots";

export type InputWithPopperComponents = InputBaseProps["components"] & {
    Transition?: React.ElementType<TransitionProps>;
};

type ClosePopper = (focusInput?: boolean) => void;

type BaseProps = ThemedComponentBaseProps<{
    root: "div";
    inputBase: typeof MuiInputBase;
    popper: typeof MuiPopper;
    paper: typeof MuiPaper;
    clickAwayListener: typeof ClickAwayListener;
}>;

export interface InputWithPopperProps extends Omit<InputBaseProps, "components" | "inputRef" | "sx" | "slotProps">, BaseProps {
    children: ((closePopper: ClosePopper) => React.ReactNode) | React.ReactNode;
    components?: InputWithPopperComponents;
    onOpenPopper?: () => void;
    onClosePopper?: () => void;
    inputRef?: React.RefObject<HTMLElement>;
    slotProps?: BaseProps["slotProps"] & {
        transition?: TransitionProps;
    };
}

export const InputWithPopper = (inProps: InputWithPopperProps) => {
    const {
        children,
        value = "",
        onOpenPopper,
        onClosePopper,
        components = {},
        inputRef: inputRefProp,
        slotProps,
        ...inputBaseProps
    } = useThemeProps({ props: inProps, name: "CometAdminInputWithPopper" });
    const { Transition = Grow, ...inputBaseComponents } = components;

    const rootRef = React.useRef<HTMLDivElement>(null);
    const ownInputRef = React.useRef<HTMLElement>(null);
    const [showPopper, setShowPopper] = React.useState<boolean>(false);

    const inputRef = inputRefProp ?? ownInputRef;

    const closePopper: ClosePopper = React.useCallback(
        (focusInput) => {
            if (showPopper) {
                if (focusInput) {
                    /**
                     * Focusing on the input, when closing the popper allows the user to continue navigating through the form, using the "Tab" key.
                     * `focus()` needs to happen before closing the popper, to prevent the popper from reopening because of the `onFocus` event.
                     */
                    inputRef.current?.focus();
                }
                setShowPopper(false);
                onClosePopper?.();
            }
        },
        [showPopper, onClosePopper, inputRef, setShowPopper],
    );

    const openPopper = () => {
        if (!showPopper) {
            setShowPopper(true);
            onOpenPopper?.();
        }
    };

    /**
     * Pressing the "Tab" key closes the popper, to allow the user to navigate to the next/previous form element.
     * The `onBlur` of `InputBase` cannot be used, this would close the popper when clicking inside the popper itself, preventing further interaction.
     */
    React.useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Tab" || e.key === "Escape") {
                closePopper(true);
            }
        };

        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [closePopper]);

    return (
        <ClickAwayListener
            mouseEvent="onMouseDown"
            touchEvent="onTouchStart"
            onClickAway={() => {
                closePopper();
            }}
            {...slotProps?.clickAwayListener}
        >
            <Root ref={rootRef} {...slotProps?.root}>
                <InputBase
                    autoComplete="off"
                    value={value}
                    {...inputBaseProps}
                    inputRef={inputRef}
                    // @ts-expect-error TODO: Fix type
                    onFocus={(e) => {
                        inputBaseProps?.onFocus && inputBaseProps.onFocus(e);
                        openPopper();
                    }}
                    components={inputBaseComponents}
                    {...slotProps?.inputBase}
                    // @ts-expect-error TODO: Fix type
                    slotProps={{
                        ...slotProps?.inputBase?.slotProps,
                        input: {
                            ...slotProps?.inputBase?.slotProps?.input,
                            // @ts-expect-error TODO: Fix type
                            onClick: (e) => {
                                slotProps?.inputBase?.slotProps?.input?.onClick?.(e);
                                /**
                                 * Opening the popper when clicking inside the `input`, is necessary to allow the user to re-open the popper,
                                 * when the input is already in focus but the popper has been closed.
                                 */
                                openPopper();
                            },
                        },
                    }}
                />
                <Popper
                    open={showPopper}
                    anchorEl={rootRef.current}
                    placement="bottom-start"
                    transition
                    onResize={undefined} // see https://github.com/mui/material-ui/issues/35287
                    onResizeCapture={undefined}
                    {...slotProps?.popper}
                >
                    {({ TransitionProps }) => (
                        <Transition {...TransitionProps} {...slotProps?.transition}>
                            <Paper {...slotProps?.paper}>{typeof children === "function" ? children(closePopper) : children}</Paper>
                        </Transition>
                    )}
                </Popper>
            </Root>
        </ClickAwayListener>
    );
};

import { ClickAwayListener, ClickAwayListenerProps, Grow, InputBase, InputBaseProps, Paper, PaperProps, Popper, PopperProps } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

import { styles } from "./InputWithPopper.styles";

export type InputWithPopperComponentsProps = InputBaseProps["componentsProps"] & {
    clickAwayListener?: Partial<ClickAwayListenerProps>;
    popper?: Partial<PopperProps>;
    transition?: Partial<TransitionProps>;
    paper?: Partial<PaperProps>;
};

export type InputWithPopperComponents = InputBaseProps["components"] & {
    Transition?: React.ElementType<TransitionProps>;
};

type ClosePopper = (focusInput?: boolean) => void;

export interface InputWithPopperProps extends Omit<InputBaseProps, "componentsProps" | "components"> {
    children: ((closePopper: ClosePopper) => React.ReactNode) | React.ReactNode;
    componentsProps?: InputWithPopperComponentsProps;
    components?: InputWithPopperComponents;
    onOpenPopper?: () => void;
    onClosePopper?: () => void;
}

function InputWithPopper({
    classes,
    children,
    value = "",
    componentsProps,
    onOpenPopper,
    onClosePopper,
    components = {},
    ...inputBaseProps
}: InputWithPopperProps & WithStyles<typeof styles>): React.ReactElement {
    const { Transition = Grow, ...inputBaseComponents } = components;

    const rootRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [showPopper, setShowPopper] = React.useState<boolean>(false);

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
            {...componentsProps?.clickAwayListener}
        >
            <div ref={rootRef} className={classes.root}>
                <InputBase
                    autoComplete="off"
                    value={value}
                    {...inputBaseProps}
                    inputRef={inputRef}
                    classes={{ root: classes.inputBase }}
                    onFocus={(e) => {
                        inputBaseProps?.onFocus && inputBaseProps.onFocus(e);
                        openPopper();
                    }}
                    components={inputBaseComponents}
                    componentsProps={{
                        root: componentsProps?.root,
                        input: {
                            ...componentsProps?.input,
                            onClick: (e) => {
                                componentsProps?.input?.onClick && componentsProps.input.onClick(e);
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
                    className={classes.popper}
                    transition
                    {...componentsProps?.popper}
                >
                    {({ TransitionProps }) => (
                        <Transition {...TransitionProps} {...componentsProps?.transition}>
                            <Paper classes={{ root: classes.paper }} {...componentsProps?.paper}>
                                {typeof children === "function" ? children(closePopper) : children}
                            </Paper>
                        </Transition>
                    )}
                </Popper>
            </div>
        </ClickAwayListener>
    );
}

const InputWithPopperWithStyles = withStyles(styles, { name: "CometAdminInputWithPopper" })(InputWithPopper);
export { InputWithPopperWithStyles as InputWithPopper };

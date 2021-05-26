import * as React from "react";
import { PropsWithChildren } from "react";

import { SplitButton, SplitButtonProps } from "../split/SplitButton";
import { SaveSplitButtonContext } from "./SaveSplitButtonContext";

export const SaveSplitButton = ({ children, disabled, showSelectButton, ...restProps }: PropsWithChildren<SplitButtonProps>) => {
    const [showSelectButtonState, setShowSelectButtonState] = React.useState<boolean | undefined>(undefined);
    const [disabledState, setDisabledState] = React.useState<boolean | undefined>(undefined);

    return (
        <SaveSplitButtonContext.Provider value={{ setShowSelectButton: setShowSelectButtonState, setDisabled: setDisabledState }}>
            <SplitButton
                {...restProps}
                disabled={disabledState != null ? disabledState : disabled}
                showSelectButton={showSelectButtonState != null ? showSelectButtonState : showSelectButton}
            >
                {children}
            </SplitButton>
        </SaveSplitButtonContext.Provider>
    );
};

import { ComponentsOverrides } from "@mui/material";
import { css, styled, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";
import { useFormState } from "react-final-form";

import { CancelButton } from "./common/buttons/cancel/CancelButton";
import { SaveButton } from "./common/buttons/save/SaveButton";
import { ThemedComponentBaseProps } from "./helpers/ThemedComponentBaseProps";
import { useStackApi } from "./stack/Api";

export interface FinalFormSaveCancelButtonsLegacyProps
    extends ThemedComponentBaseProps<{
        root: "div";
        cancelButton: typeof CancelButton;
        saveButton: typeof SaveButton;
    }> {
    cancelIcon?: React.ReactNode;
    saveIcon?: React.ReactNode;
}

export type FinalFormSaveCancelButtonsLegacyClassKey = "root" | "cancelButton" | "saveButton";

const Root = styled("div", {
    name: "CometAdminFinalFormSaveCancelButtonsLegacy",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})();

const StyledCancelButton = styled(CancelButton, {
    name: "CometAdminFinalFormSaveCancelButtonsLegacy",
    slot: "cancelButton",
    overridesResolver(_, styles) {
        return [styles.cancelButton];
    },
})(
    ({ theme }) => css`
        margin: ${theme.spacing(1)};
    `,
);

const StyledSaveButton = styled(SaveButton, {
    name: "CometAdminFinalFormSaveCancelButtonsLegacy",
    slot: "saveButton",
    overridesResolver(_, styles) {
        return [styles.saveButton];
    },
})(
    ({ theme }) => css`
        margin: ${theme.spacing(1)};
    `,
);

export function FinalFormSaveCancelButtonsLegacy(inProps: FinalFormSaveCancelButtonsLegacyProps) {
    const { cancelIcon, saveIcon, slotProps, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminFinalFormSaveCancelButtonsLegacy" });
    const stackApi = useStackApi();
    const formState = useFormState();

    return (
        <Root {...slotProps?.root} {...restProps}>
            {stackApi?.breadCrumbs != null && stackApi?.breadCrumbs.length > 1 && (
                <StyledCancelButton
                    startIcon={cancelIcon}
                    onClick={() => {
                        stackApi.goBack();
                    }}
                    {...slotProps?.cancelButton}
                />
            )}
            <StyledSaveButton
                startIcon={saveIcon}
                type="submit"
                disabled={formState.pristine || formState.hasValidationErrors || formState.submitting}
                {...slotProps?.saveButton}
            />
        </Root>
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminFinalFormSaveCancelButtonsLegacy: FinalFormSaveCancelButtonsLegacyClassKey;
    }

    interface ComponentsPropsList {
        CometAdminFinalFormSaveCancelButtonsLegacy: Partial<FinalFormSaveCancelButtonsLegacyProps>;
    }

    interface Components {
        CometAdminFinalFormSaveCancelButtonsLegacy?: {
            defaultProps?: ComponentsPropsList["CometAdminFinalFormSaveCancelButtonsLegacy"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFinalFormSaveCancelButtonsLegacy"];
        };
    }
}

import { ComponentsOverrides, Theme } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";
import { useFormState } from "react-final-form";

import { CancelButton } from "./common/buttons/cancel/CancelButton";
import { SaveButton } from "./common/buttons/save/SaveButton";
import { useStackApi } from "./stack/Api";

export interface FinalFormSaveCancelButtonsLegacyProps {
    cancelIcon?: React.ReactNode;
    saveIcon?: React.ReactNode;
}

export type FinalFormSaveCancelButtonsLegacyClassKey = "root" | "cancelButton" | "saveButton";

const styles = (theme: Theme) => {
    return createStyles<FinalFormSaveCancelButtonsLegacyClassKey, FinalFormSaveCancelButtonsLegacyProps>({
        root: {},
        cancelButton: {
            margin: theme.spacing(1),
        },
        saveButton: {
            margin: theme.spacing(1),
        },
    });
};

const FinalFormSaveCancelButtonsLegacyComponent = ({
    classes,
    cancelIcon,
    saveIcon,
}: FinalFormSaveCancelButtonsLegacyProps & WithStyles<typeof styles>): React.ReactElement => {
    const stackApi = useStackApi();
    const formState = useFormState();

    return (
        <div className={classes.root}>
            {stackApi?.breadCrumbs != null && stackApi?.breadCrumbs.length > 1 && (
                <CancelButton
                    classes={{ root: classes.cancelButton }}
                    startIcon={cancelIcon}
                    onClick={() => {
                        stackApi.goBack();
                    }}
                />
            )}
            <SaveButton
                classes={{ root: classes.saveButton }}
                startIcon={saveIcon}
                type="submit"
                disabled={formState.pristine || formState.hasValidationErrors || formState.submitting}
            />
        </div>
    );
};

export const FinalFormSaveCancelButtonsLegacy = withStyles(styles, { name: "CometAdminFinalFormSaveCancelButtonsLegacy" })(
    FinalFormSaveCancelButtonsLegacyComponent,
);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminFinalFormSaveCancelButtonsLegacy: FinalFormSaveCancelButtonsLegacyClassKey;
    }

    interface ComponentsPropsList {
        CometAdminFinalFormSaveCancelButtonsLegacy: FinalFormSaveCancelButtonsLegacyProps;
    }

    interface Components {
        CometAdminFinalFormSaveCancelButtonsLegacy?: {
            defaultProps?: ComponentsPropsList["CometAdminFinalFormSaveCancelButtonsLegacy"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFinalFormSaveCancelButtonsLegacy"];
        };
    }
}

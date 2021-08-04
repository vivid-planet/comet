import * as React from "react";
import { useFormState } from "react-final-form";

import { CancelButton } from "./common/buttons/cancel/CancelButton";
import { SaveButton } from "./common/buttons/save/SaveButton";
import { useStyles, useThemeProps } from "./FinalFormSaveCancelButtonsLegacy.styles";
import { useStackApi } from "./stack/Api";

export const FinalFormSaveCancelButtonsLegacy = () => {
    const styles = useStyles();
    const stackApi = useStackApi();
    const themeProps = useThemeProps();

    const formState = useFormState();
    return (
        <div className={styles.root}>
            {stackApi?.breadCrumbs != null && stackApi?.breadCrumbs.length > 1 && (
                <CancelButton
                    classes={{ root: styles.cancelButton }}
                    startIcon={themeProps.cancelIcon}
                    onClick={() => {
                        stackApi.goBack();
                    }}
                />
            )}
            <SaveButton
                classes={{ root: styles.saveButton }}
                startIcon={themeProps.saveIcon}
                type="submit"
                disabled={formState.pristine || formState.hasValidationErrors || formState.submitting}
            />
        </div>
    );
};

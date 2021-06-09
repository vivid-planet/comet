import { Button, Typography } from "@material-ui/core";
import * as React from "react";
import { useFormState } from "react-final-form";
import { FormattedMessage } from "react-intl";

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
                <Button
                    classes={{ root: styles.cancelButton }}
                    startIcon={themeProps.cancelIcon}
                    variant="text"
                    color="default"
                    onClick={() => {
                        stackApi.goBack();
                    }}
                >
                    <Typography variant="button">
                        <FormattedMessage id="cometAdmin.generic.cancel" defaultMessage="Cancel" />
                    </Typography>
                </Button>
            )}
            <Button
                classes={{ root: styles.saveButton }}
                startIcon={themeProps.saveIcon}
                variant="contained"
                color="primary"
                type="submit"
                disabled={formState.pristine || formState.hasValidationErrors || formState.submitting}
            >
                <Typography variant="button">
                    <FormattedMessage id="cometAdmin.generic.save" defaultMessage="Save" />
                </Typography>
            </Button>
        </div>
    );
};

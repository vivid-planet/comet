import { Button, Typography } from "@material-ui/core";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { StackApiContext } from "../Api";
import { useThemeProps } from "./StackBackButton.styles";

export const StackBackButton = (): React.ReactElement => {
    const themeProps = useThemeProps();
    return (
        <StackApiContext.Consumer>
            {(stackApi) => {
                return (
                    <Button
                        color="default"
                        disabled={stackApi?.breadCrumbs == null || stackApi?.breadCrumbs.length <= 1}
                        onClick={stackApi?.goBack}
                        {...themeProps.buttonProps}
                    >
                        <Typography variant="button">
                            <FormattedMessage id="cometAdmin.generic.back" defaultMessage="Back" />
                        </Typography>
                    </Button>
                );
            }}
        </StackApiContext.Consumer>
    );
};

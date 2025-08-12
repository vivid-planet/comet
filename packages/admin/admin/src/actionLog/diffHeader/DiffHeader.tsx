import { Box, Typography } from "@mui/material";
import { type FunctionComponent } from "react";
import { FormattedDate, FormattedMessage } from "react-intl";

import { Root } from "./DiffHeader.sc";

type DiffHeaderProps = {
    createdAt?: string;
    userId?: string;
    version?: number;
};

export const DiffHeader: FunctionComponent<DiffHeaderProps> = ({ createdAt, userId, version }) => {
    return (
        <Root>
            <Typography color="white" variant="subtitle1">
                <FormattedMessage defaultMessage="Version {version}" id="actionLog.actionLogCompare.diffHeader.version" values={{ version }} />
            </Typography>

            <Box>
                <Typography color="textSecondary" variant="caption">
                    <FormattedMessage
                        defaultMessage="{user} am {date}"
                        id="actionLog.actionLogCompare.diffHeader.userNameAndTime"
                        values={{
                            date: (
                                <Typography color="textSecondary" variant="overline">
                                    <FormattedDate dateStyle="short" timeStyle="short" value={createdAt} />
                                </Typography>
                            ),
                            user: (
                                <Typography color="textSecondary" variant="overline">
                                    {userId}
                                </Typography>
                            ),
                        }}
                    />
                </Typography>
            </Box>
        </Root>
    );
};

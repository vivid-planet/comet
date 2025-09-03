import { Typography } from "@mui/material";
import { FormattedDate, FormattedMessage } from "react-intl";

import { Root } from "./DiffHeader.sc";

export interface DiffHeaderProps {
    createdAt?: string;
    userId?: string;
    version?: number;
}

export const DiffHeader = ({ createdAt, userId, version }: DiffHeaderProps) => {
    return (
        <Root>
            <Typography color="white" variant="subtitle1">
                <FormattedMessage defaultMessage="Version {version}" id="actionLog.actionLogCompare.diffHeader.version" values={{ version }} />
            </Typography>

            <Typography color="textSecondary" variant="caption">
                <FormattedMessage
                    defaultMessage="{userId} on {date}"
                    id="actionLog.actionLogCompare.diffHeader.userIdAndTime"
                    values={{
                        date: (
                            <Typography color="textSecondary" variant="overline" component="span">
                                <FormattedDate dateStyle="short" timeStyle="short" value={createdAt} />
                            </Typography>
                        ),
                        userId: (
                            <Typography color="textSecondary" variant="overline" component="span">
                                {userId}
                            </Typography>
                        ),
                    }}
                />
            </Typography>
        </Root>
    );
};

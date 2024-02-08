import { messages, Stack, StackPage, StackSwitch } from "@comet/admin";
import { Domain } from "@comet/admin-icons";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ContentScopeIndicator } from "../contentScope/ContentScopeIndicator";
import { CronJobsGrid } from "./CronJobsGrid";
import { JobsGrid } from "./JobsGrid";

const ScopeIndicatorLabelBold = styled(Typography)`
    && {
        font-weight: 400;
        padding: 0 8px 0 4px;
        text-transform: uppercase;
    }
`;

const ScopeIndicatorContent = styled("div")`
    display: flex;
    align-items: center;
`;

export function CronJobsPage(): React.ReactElement {
    const intl = useIntl();

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "comet.pages.cronJobs", defaultMessage: "Cron Jobs" })}>
            <StackSwitch>
                <StackPage name="grid">
                    <ContentScopeIndicator variant="toolbar">
                        <ScopeIndicatorContent>
                            <Domain fontSize="small" />
                            <ScopeIndicatorLabelBold variant="body2">
                                <FormattedMessage {...messages.globalContentScope} />
                            </ScopeIndicatorLabelBold>
                        </ScopeIndicatorContent>
                    </ContentScopeIndicator>

                    <CronJobsGrid />
                </StackPage>
                <StackPage name="jobs">{(cronJob) => <JobsGrid cronJob={cronJob} />}</StackPage>
            </StackSwitch>
        </Stack>
    );
}

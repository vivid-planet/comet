import { Stack, StackPage, StackSwitch } from "@comet/admin";
import * as React from "react";
import { useIntl } from "react-intl";

import { ContentScopeIndicator } from "../contentScope/ContentScopeIndicator";
import { CronJobsGrid } from "./CronJobsGrid";
import { JobsGrid } from "./JobsGrid";

export function CronJobsPage(): React.ReactElement {
    const intl = useIntl();

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "comet.pages.cronJobs", defaultMessage: "Cron Jobs" })}>
            <StackSwitch>
                <StackPage name="grid">
                    <ContentScopeIndicator global />
                    <CronJobsGrid />
                </StackPage>
                <StackPage name="jobs">{(cronJob) => <JobsGrid cronJob={cronJob} />}</StackPage>
            </StackSwitch>
        </Stack>
    );
}

import { Stack, StackPage, StackSwitch } from "@comet/admin";
import * as React from "react";
import { useIntl } from "react-intl";

import { ContentScopeIndicator } from "../contentScope/ContentScopeIndicator";
import { ContentScopeInterface, useContentScope } from "../contentScope/Provider";
import { CronJobsGrid } from "./CronJobsGrid";
import { JobsGrid } from "./JobsGrid";

interface CronJobsPageProps {
    renderContentScopeIndicator?: (scope: ContentScopeInterface) => React.ReactNode;
}

const defaultRenderContentScopeIndicator = () => <ContentScopeIndicator global />;

export function CronJobsPage({ renderContentScopeIndicator = defaultRenderContentScopeIndicator }: CronJobsPageProps): React.ReactElement {
    const { scope } = useContentScope();
    const intl = useIntl();

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "comet.pages.cronJobs", defaultMessage: "Cron Jobs" })}>
            <StackSwitch>
                <StackPage name="grid">
                    {renderContentScopeIndicator(scope)}
                    <CronJobsGrid />
                </StackPage>
                <StackPage name="jobs">{(cronJob) => <JobsGrid cronJob={cronJob} />}</StackPage>
            </StackSwitch>
        </Stack>
    );
}

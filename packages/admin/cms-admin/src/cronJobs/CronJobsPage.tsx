import { Stack, StackPage, StackSwitch } from "@comet/admin";
import { useIntl } from "react-intl";

import { CronJobsGrid } from "./CronJobsGrid";
import { JobLogs } from "./JobLogs";
import { JobsGrid } from "./JobsGrid";

export function CronJobsPage() {
    const intl = useIntl();

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "comet.pages.cronJobs", defaultMessage: "Cron Jobs" })}>
            <StackSwitch>
                <StackPage name="grid">
                    <CronJobsGrid />
                </StackPage>
                <StackPage name="jobs">
                    {(selectedCronJobName) => (
                        <StackSwitch>
                            <StackPage name="grid">
                                <JobsGrid cronJob={selectedCronJobName} />
                            </StackPage>
                            <StackPage name="logs">{(selectedJobName) => <JobLogs jobName={selectedJobName} />}</StackPage>
                        </StackSwitch>
                    )}
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}

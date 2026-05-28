import {
    Button,
    FillSpace,
    MainContent,
    SaveBoundary,
    SaveBoundarySaveButton,
    Stack,
    StackLink,
    StackPage,
    StackSwitch,
    StackToolbar,
    ToolbarActions,
    ToolbarAutomaticTitleItem,
    ToolbarBackButton,
} from "@comet/admin";
import { Time } from "@comet/admin-icons";
import { ContentScopeIndicator, createEntityActionLogsQuery, EntityActionLogGrid, useContentScopeConfig } from "@comet/cms-admin";
import { FormattedMessage, useIntl } from "react-intl";

import { NewsForm } from "./generated/NewsForm";
import { NewsGrid } from "./generated/NewsGrid";

const newsActionLogsQuery = createEntityActionLogsQuery("newsActionLogs");

const FormToolbar = () => (
    <StackToolbar scopeIndicator={<ContentScopeIndicator />}>
        <ToolbarBackButton />
        <ToolbarAutomaticTitleItem />
        <FillSpace />
        <ToolbarActions>
            <SaveBoundarySaveButton />
        </ToolbarActions>
    </StackToolbar>
);

export function NewsPage() {
    const intl = useIntl();

    useContentScopeConfig({ redirectPathAfterChange: "/structured-content/news" });

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "news.news", defaultMessage: "News" })}>
            <StackSwitch>
                <StackPage name="grid">
                    <StackToolbar scopeIndicator={<ContentScopeIndicator />}>
                        <FillSpace />
                        <ToolbarActions>
                            <Button variant="textDark" startIcon={<Time />} component={StackLink} pageName="action-log" payload="action-log">
                                <FormattedMessage id="news.actionLog" defaultMessage="Action Log" />
                            </Button>
                        </ToolbarActions>
                    </StackToolbar>
                    <MainContent fullHeight>
                        <NewsGrid />
                    </MainContent>
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "news.editNews", defaultMessage: "Edit News" })}>
                    {(selectedNewsId) => (
                        <SaveBoundary>
                            <FormToolbar />
                            <MainContent>
                                <NewsForm id={selectedNewsId} />
                            </MainContent>
                        </SaveBoundary>
                    )}
                </StackPage>
                <StackPage name="add" title={intl.formatMessage({ id: "news.addNews", defaultMessage: "Add News" })}>
                    <SaveBoundary>
                        <FormToolbar />
                        <MainContent>
                            <NewsForm />
                        </MainContent>
                    </SaveBoundary>
                </StackPage>
                <StackPage name="action-log" title={intl.formatMessage({ id: "news.actionLog", defaultMessage: "Action Log" })}>
                    <StackToolbar scopeIndicator={<ContentScopeIndicator />}>
                        <ToolbarBackButton />
                        <ToolbarAutomaticTitleItem />
                    </StackToolbar>
                    <EntityActionLogGrid
                        actionLogsQuery={newsActionLogsQuery}
                        queryResultKey="newsActionLogs"
                        persistentColumnStateKey="NewsActionLogGrid"
                    />
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}

import { gql, useQuery } from "@apollo/client";
import {
    FillSpace,
    Loading,
    LocalErrorScopeApolloContext,
    MainContent,
    SaveBoundary,
    SaveBoundarySaveButton,
    Stack,
    StackPage,
    StackSwitch,
    StackToolbar,
    ToolbarActions,
    ToolbarAutomaticTitleItem,
    ToolbarBackButton,
} from "@comet/admin";
import { ContentScopeIndicator, NotFound, useContentScopeConfig } from "@comet/cms-admin";
import { useIntl } from "react-intl";

import { NewsForm } from "./generated/NewsForm";
import { NewsGrid } from "./generated/NewsGrid";

const newsExistsQuery = gql`
    query NewsExists($id: ID!) {
        news(id: $id) {
            id
        }
    }
`;

function NewsEditContent({ id }: { id: string }) {
    const { data, error, loading } = useQuery<{ news: { id: string } | null }, { id: string }>(newsExistsQuery, {
        variables: { id },
        context: LocalErrorScopeApolloContext,
    });

    if (loading) {
        return <Loading behavior="fillPageHeight" />;
    }

    if (error || !data?.news) {
        return <NotFound />;
    }

    return (
        <SaveBoundary>
            <FormToolbar />
            <MainContent>
                <NewsForm id={id} />
            </MainContent>
        </SaveBoundary>
    );
}

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
                    <StackToolbar scopeIndicator={<ContentScopeIndicator />} />
                    <MainContent fullHeight>
                        <NewsGrid />
                    </MainContent>
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "news.editNews", defaultMessage: "Edit News" })}>
                    {(selectedNewsId) => <NewsEditContent id={selectedNewsId} />}
                </StackPage>
                <StackPage name="add" title={intl.formatMessage({ id: "news.addNews", defaultMessage: "Add News" })}>
                    <SaveBoundary>
                        <FormToolbar />
                        <MainContent>
                            <NewsForm />
                        </MainContent>
                    </SaveBoundary>
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}

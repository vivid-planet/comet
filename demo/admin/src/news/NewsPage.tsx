import {
    FillSpace,
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
import { ContentScopeIndicator } from "@comet/cms-admin";
import { useContentScope } from "@src/common/ContentScopeProvider";
import { useIntl } from "react-intl";

import { NewsForm } from "./generated/NewsForm";
import { NewsGrid } from "./generated/NewsGrid";

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
    const { scope } = useContentScope();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "news.news", defaultMessage: "News" })}>
            <StackSwitch>
                <StackPage name="grid">
                    <StackToolbar scopeIndicator={<ContentScopeIndicator />} />
                    <MainContent fullHeight>
                        <NewsGrid />
                    </MainContent>
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "news.news", defaultMessage: "Edit News" })}>
                    {(selectedNewsId) => (
                        <SaveBoundary>
                            <FormToolbar />
                            <MainContent>
                                <NewsForm id={selectedNewsId} scope={scope} />
                            </MainContent>
                        </SaveBoundary>
                    )}
                </StackPage>
                <StackPage name="add" title={intl.formatMessage({ id: "news.news", defaultMessage: "Add News" })}>
                    <SaveBoundary>
                        <FormToolbar />
                        <MainContent>
                            <NewsForm scope={scope} />
                        </MainContent>
                    </SaveBoundary>
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}

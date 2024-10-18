import {
    MainContent,
    SaveBoundary,
    SaveBoundarySaveButton,
    Stack,
    StackToolbar,
    ToolbarActions,
    ToolbarAutomaticTitleItem,
    ToolbarBackButton,
    ToolbarFillSpace,
} from "@comet/admin";
import { ContentScopeIndicator } from "@comet/cms-admin";
import { CreateCapProductForm } from "@src/products/future/generated/CreateCapProductForm";
import { useIntl } from "react-intl";

export function CreateCapProductPage() {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "products.createCapProduct", defaultMessage: "Create Cap Product" })}>
            <SaveBoundary>
                <StackToolbar scopeIndicator={<ContentScopeIndicator global />}>
                    <ToolbarBackButton />
                    <ToolbarAutomaticTitleItem />
                    <ToolbarFillSpace />
                    <ToolbarActions>
                        <SaveBoundarySaveButton />
                    </ToolbarActions>
                </StackToolbar>
                <MainContent>
                    <CreateCapProductForm type="Cap" />
                </MainContent>
            </SaveBoundary>
        </Stack>
    );
}

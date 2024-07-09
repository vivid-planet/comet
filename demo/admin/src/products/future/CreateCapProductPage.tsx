import {
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
import * as React from "react";
import { useIntl } from "react-intl";

export function CreateCapProductPage(): React.ReactElement {
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
                <CreateCapProductForm type="Cap" />
            </SaveBoundary>
        </Stack>
    );
}

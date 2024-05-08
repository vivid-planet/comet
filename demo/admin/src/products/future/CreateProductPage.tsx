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
import { CreateProductForm } from "@src/products/future/generated/CreateProductForm";
import * as React from "react";
import { useIntl } from "react-intl";

export function CreateProductPage(): React.ReactElement {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "products.createCapProduct", defaultMessage: "Create Cap Product" })}>
            <SaveBoundary>
                <StackToolbar>
                    <ToolbarBackButton />
                    <ToolbarAutomaticTitleItem />
                    <ToolbarFillSpace />
                    <ToolbarActions>
                        <SaveBoundarySaveButton />
                    </ToolbarActions>
                </StackToolbar>
                <CreateProductForm />
            </SaveBoundary>
        </Stack>
    );
}

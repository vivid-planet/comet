import {
    SaveBoundary,
    SaveBoundarySaveButton,
    Stack,
    StackPage,
    StackSwitch,
    StackToolbar,
    Toolbar,
    ToolbarActions,
    ToolbarAutomaticTitleItem,
    ToolbarBackButton,
    ToolbarFillSpace,
} from "@comet/admin";
import { ContentScopeIndicator } from "@comet/cms-admin";
import { ManufacturerForm } from "@src/products/ManufacturerForm";
import { ManufacturersGrid } from "@src/products/ManufacturersGrid";
import * as React from "react";
import { useIntl } from "react-intl";

export function ManufacturersPage(): React.ReactElement {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "products.manufacturers", defaultMessage: "Manufacturers" })}>
            <StackSwitch>
                <StackPage name="grid">
                    <Toolbar scopeIndicator={<ContentScopeIndicator global />} hideBottomBar />
                    <ManufacturersGrid />
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "products.editManufacturers", defaultMessage: "Edit Manufacturers" })}>
                    {(selectedId) => (
                        <SaveBoundary>
                            <StackToolbar>
                                <ToolbarBackButton />
                                <ToolbarAutomaticTitleItem />
                                <ToolbarFillSpace />
                                <ToolbarActions>
                                    <SaveBoundarySaveButton />
                                </ToolbarActions>
                            </StackToolbar>
                            <ManufacturerForm id={selectedId} />
                        </SaveBoundary>
                    )}
                </StackPage>
                <StackPage name="add" title={intl.formatMessage({ id: "products.addManufacturers", defaultMessage: "Add Manufacturers" })}>
                    <SaveBoundary>
                        <StackToolbar>
                            <ToolbarBackButton />
                            <ToolbarAutomaticTitleItem />
                            <ToolbarFillSpace />
                            <ToolbarActions>
                                <SaveBoundarySaveButton />
                            </ToolbarActions>
                        </StackToolbar>
                        <ManufacturerForm />
                    </SaveBoundary>
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}

import {
    MainContent,
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
import { ManufacturersGrid } from "@src/products/future/generated/ManufacturersGrid";
import * as React from "react";
import { useIntl } from "react-intl";

export function ManufacturersPage(): React.ReactElement {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "manufacturers.manufacturers", defaultMessage: "Manufacturers" })}>
            <StackSwitch>
                <StackPage name="grid">
                    <Toolbar />
                    <MainContent fullHeight>
                        <ManufacturersGrid />
                    </MainContent>
                </StackPage>
                <StackPage
                    name="add"
                    title={intl.formatMessage({
                        id: "manufacturers.addManufacturer",
                        defaultMessage: "Add Manufacturer",
                    })}
                >
                    <SaveBoundary>
                        <StackToolbar>
                            <ToolbarBackButton />
                            <ToolbarAutomaticTitleItem />
                            <ToolbarFillSpace />
                            <ToolbarActions>
                                <SaveBoundarySaveButton />
                            </ToolbarActions>
                        </StackToolbar>
                        <div>Add Manufacturer</div>
                    </SaveBoundary>
                </StackPage>
                <StackPage
                    name="edit"
                    title={intl.formatMessage({
                        id: "manufacturers.editManufacturer",
                        defaultMessage: "Edit Manufacturer",
                    })}
                >
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
                            <div>Edit Manufacturer</div>
                        </SaveBoundary>
                    )}
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}

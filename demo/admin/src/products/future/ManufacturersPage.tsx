import {
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
    ToolbarFillSpace,
} from "@comet/admin";
import { Add as AddIcon, Edit } from "@comet/admin-icons";
import { Button, IconButton } from "@mui/material";
import { ManufacturersGrid } from "@src/products/future/generated/ManufacturersGrid";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export function ManufacturersPage(): React.ReactElement {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "manufacturers.manufacturers", defaultMessage: "Manufacturers" })}>
            <StackSwitch>
                <StackPage name="grid">
                    <MainContent fullHeight disablePadding>
                        <ManufacturersGrid
                            addButton={
                                <Button
                                    startIcon={<AddIcon />}
                                    component={StackLink}
                                    pageName="add"
                                    payload="add"
                                    variant="contained"
                                    color="primary"
                                >
                                    <FormattedMessage id="manufacturer.newManufacturer" defaultMessage="New Manufacturer" />
                                </Button>
                            }
                            editButton={(params) => (
                                <IconButton component={StackLink} pageName="edit" payload={params.row.id}>
                                    <Edit color="primary" />
                                </IconButton>
                            )}
                        />
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

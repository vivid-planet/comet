import {
    Button,
    FillSpace,
    SaveBoundary,
    SaveBoundarySaveButton,
    Stack,
    StackMainContent,
    StackPage,
    StackSwitch,
    StackToolbar,
    ToolbarActions,
    ToolbarAutomaticTitleItem,
    ToolbarBackButton,
} from "@comet/admin";
import { ContentScopeIndicator, useActionLogDialog } from "@comet/cms-admin";
import { ManufacturerForm } from "@src/products/ManufacturerForm";
import { ManufacturersGrid } from "@src/products/ManufacturersGrid";
import { FormattedMessage, useIntl } from "react-intl";

const EditFormToolbar = ({ id }: { id: string }) => {
    const [ActionLogDialog, { openActionLogDialog }] = useActionLogDialog({ rootField: "manufacturer", id });

    return (
        <StackToolbar>
            <ToolbarBackButton />
            <ToolbarAutomaticTitleItem />
            <FillSpace />
            <ToolbarActions>
                <Button variant="textDark" onClick={openActionLogDialog}>
                    <FormattedMessage id="manufacturer.versionHistory" defaultMessage="Version history" />
                </Button>
                <SaveBoundarySaveButton />
            </ToolbarActions>
            <ActionLogDialog />
        </StackToolbar>
    );
};

const AddFormToolbar = () => (
    <StackToolbar>
        <ToolbarBackButton />
        <ToolbarAutomaticTitleItem />
        <FillSpace />
        <ToolbarActions>
            <SaveBoundarySaveButton />
        </ToolbarActions>
    </StackToolbar>
);

export function ManufacturersPage() {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "products.manufacturers", defaultMessage: "Manufacturers" })}>
            <StackSwitch>
                <StackPage name="grid">
                    <StackToolbar scopeIndicator={<ContentScopeIndicator global />} />
                    <StackMainContent fullHeight>
                        <ManufacturersGrid />
                    </StackMainContent>
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "products.editManufacturers", defaultMessage: "Edit Manufacturers" })}>
                    {(selectedId) => (
                        <SaveBoundary>
                            <EditFormToolbar id={selectedId} />
                            <StackMainContent>
                                <ManufacturerForm id={selectedId} />
                            </StackMainContent>
                        </SaveBoundary>
                    )}
                </StackPage>
                <StackPage name="add" title={intl.formatMessage({ id: "products.addManufacturers", defaultMessage: "Add Manufacturers" })}>
                    <SaveBoundary>
                        <AddFormToolbar />
                        <StackMainContent>
                            <ManufacturerForm />
                        </StackMainContent>
                    </SaveBoundary>
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}

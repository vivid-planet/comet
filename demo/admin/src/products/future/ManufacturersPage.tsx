import { MainContent, Stack, StackPage, StackSwitch, StackToolbar } from "@comet/admin";
import { ContentScopeIndicator } from "@comet/cms-admin";
import { ManufacturersGrid } from "@src/products/future/generated/ManufacturersGrid";
import { useIntl } from "react-intl";

export function ManufacturersPage() {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "manufacturers.manufacturers", defaultMessage: "Manufacturers" })}>
            <StackSwitch>
                <StackPage name="grid">
                    <StackToolbar scopeIndicator={<ContentScopeIndicator global />} />
                    <MainContent fullHeight>
                        <ManufacturersGrid />
                    </MainContent>
                </StackPage>
                <StackPage name="add" title={intl.formatMessage({ id: "manufacturers.addManufacturer", defaultMessage: "Add Manufacturer" })}>
                    <div>Add Manufacturer</div>
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "manufacturers.editManufacturer", defaultMessage: "Edit Manufacturer" })}>
                    {(selectedId) => <div>Edit Manufacturer</div>}
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}

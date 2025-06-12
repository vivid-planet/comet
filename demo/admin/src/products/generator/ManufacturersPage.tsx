import { Stack, StackMainContent, StackPage, StackSwitch, StackToolbar } from "@comet/admin";
import { ContentScopeIndicator } from "@comet/cms-admin";
import { ManufacturersGrid } from "@src/products/generator/generated/ManufacturersGrid";
import { useIntl } from "react-intl";

export function ManufacturersPage() {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "manufacturers.manufacturers", defaultMessage: "Manufacturers" })}>
            <StackSwitch>
                <StackPage name="grid">
                    <StackToolbar scopeIndicator={<ContentScopeIndicator global />} />
                    <StackMainContent fullHeight>
                        <ManufacturersGrid />
                    </StackMainContent>
                </StackPage>
                <StackPage name="add" title={intl.formatMessage({ id: "manufacturers.addManufacturer", defaultMessage: "Add Manufacturer" })}>
                    {/* eslint-disable-next-line @calm/react-intl/missing-formatted-message,@comet/no-jsx-string-literals */}
                    <StackMainContent>TODO: Add manufacturer form</StackMainContent>
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "manufacturers.editManufacturer", defaultMessage: "Edit Manufacturer" })}>
                    {(selectedId) => (
                        // eslint-disable-next-line @calm/react-intl/missing-formatted-message,@comet/no-jsx-string-literals
                        <StackMainContent>TODO: Edit manufacturer form</StackMainContent>
                    )}
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}

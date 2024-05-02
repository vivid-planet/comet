import { Stack, StackPage, StackSwitch } from "@comet/admin";
import { ManufacturersGrid } from "@src/products/future/generated/ManufacturersGrid";
import * as React from "react";
import { useIntl } from "react-intl";

export function ManufacturersPage(): React.ReactElement {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "manufacturers.manufacturers", defaultMessage: "Manufacturers" })}>
            <StackSwitch>
                <StackPage name="grid">
                    <ManufacturersGrid />
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

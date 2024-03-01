import { Stack, StackPage, StackSwitch } from "@comet/admin";
import { ManufacturersGrid } from "@src/products/future/generated/ManufacturersGrid";
// import { ManufacturerForm } from "@src/products/future/generated/ManufacturerForm";
import * as React from "react";
import { useIntl } from "react-intl";

export function ManufacturersPage(): React.ReactElement {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "products.manufacturers", defaultMessage: "Manufacturers" })}>
            <StackSwitch>
                <StackPage name="grid">
                    <ManufacturersGrid />
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "products.editManufacturers", defaultMessage: "Edit Manufacturers" })}>
                    {/*{(selectedId) => <ManufacturerForm id={selectedId} />}*/}
                </StackPage>
                <StackPage name="add" title={intl.formatMessage({ id: "products.addManufacturers", defaultMessage: "Add Manufacturers" })}>
                    {/*<ManufacturerForm />*/}
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}

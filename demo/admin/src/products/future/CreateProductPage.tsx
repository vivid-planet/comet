import { Stack } from "@comet/admin";
import { CreateProductForm } from "@src/products/future/generated/CreateProductForm";
import * as React from "react";
import { useIntl } from "react-intl";

export function CreateProductPage(): React.ReactElement {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "products.createCapProduct", defaultMessage: "Create Cap Product" })}>
            <CreateProductForm />
        </Stack>
    );
}

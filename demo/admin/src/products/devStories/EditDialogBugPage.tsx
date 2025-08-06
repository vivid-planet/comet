import { Button, Stack, StackMainContent, StackToolbar, useEditDialog } from "@comet/admin";
import { Add as AddIcon } from "@comet/admin-icons";
import { ContentScopeIndicator } from "@comet/cms-admin";
import { FormattedMessage, useIntl } from "react-intl";

import { ProductForm } from "../generator/generated/ProductForm";
import { ProductsGrid } from "../generator/generated/ProductsGrid";

export function EditDialogBugPage() {
    const intl = useIntl();
    const [EditDialog, , editDialogApi] = useEditDialog();

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "devStories.editDailogBug", defaultMessage: "Edit-Dialog Bug" })}>
            <StackToolbar scopeIndicator={<ContentScopeIndicator global />} />
            <StackMainContent fullHeight>
                <ProductsGrid
                    toolbarAction={
                        <Button responsive startIcon={<AddIcon />} onClick={() => editDialogApi?.openAddDialog()}>
                            <FormattedMessage id="devStories.editDailogBug.newProduct" defaultMessage="New Product" />
                        </Button>
                    }
                />
                <EditDialog>
                    <ProductForm />
                </EditDialog>
            </StackMainContent>
        </Stack>
    );
}

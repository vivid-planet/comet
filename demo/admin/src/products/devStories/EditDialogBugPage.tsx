import { Button, MainContent, Toolbar, useEditDialog } from "@comet/admin";
import { Add as AddIcon } from "@comet/admin-icons";
import { ContentScopeIndicator } from "@comet/cms-admin";
import { FormattedMessage } from "react-intl";

import { ProductForm } from "../generator/generated/ProductForm";
import { ProductsGrid } from "../generator/generated/ProductsGrid";

export function EditDialogBugPage() {
    const [EditDialog, , editDialogApi] = useEditDialog();

    return (
        <>
            <Toolbar scopeIndicator={<ContentScopeIndicator global />} />
            <MainContent fullHeight>
                <ProductsGrid
                    toolbarAction={
                        <Button responsive startIcon={<AddIcon />} onClick={() => editDialogApi?.openAddDialog()}>
                            <FormattedMessage id="devStories.editDailogBug.newProduct" defaultMessage="New Product" />
                        </Button>
                    }
                />
                <EditDialog>
                    <ProductForm manufacturerCountry="at" />
                </EditDialog>
            </MainContent>
        </>
    );
}

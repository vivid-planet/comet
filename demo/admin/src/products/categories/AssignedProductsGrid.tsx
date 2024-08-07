import { useApolloClient } from "@apollo/client";
import { CancelButton, SaveBoundary, SaveBoundarySaveButton } from "@comet/admin";
import { Add as AddIcon } from "@comet/admin-icons";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { AssignProductsGrid } from "@src/products/categories/AssignProductsGrid";
import { ProductsGrid, productsQuery } from "@src/products/ProductsGrid";
import React from "react";
import { FormattedMessage } from "react-intl";

type Props = {
    productCategoryId: string;
};

export function AssignedProductsGrid({ productCategoryId }: Props): React.ReactElement {
    const client = useApolloClient();
    const [isOpen, setIsOpen] = React.useState(false);
    const refetchProductsGrid = async () => {
        await client.refetchQueries({ include: [productsQuery] });
    };

    const handleCloseDialog = async () => {
        setIsOpen(false);
        await refetchProductsGrid();
    };
    return (
        <>
            <ProductsGrid
                // TODO refresh ProductsGrid after saving assign-products
                toolbarAction={
                    <Button startIcon={<AddIcon />} onClick={() => setIsOpen(true)} variant="contained" color="primary">
                        <FormattedMessage id="products.editProductCategory.assignProducts" defaultMessage="Assign Products" />
                    </Button>
                }
                filter={{ category: { equal: productCategoryId } }}
            />
            <SaveBoundary
                onAfterSave={async () => {
                    setIsOpen(false);
                    await refetchProductsGrid();
                }}
            >
                <Dialog open={isOpen} onClose={handleCloseDialog} fullWidth maxWidth="xl">
                    <DialogTitle>
                        <FormattedMessage id="products.editProductCategory.assignProducts" defaultMessage="Assign Products" />
                    </DialogTitle>
                    <DialogContent
                        sx={{
                            height: "70vh",
                            padding: 0,
                            paddingTop: "0 !important" /* is connected to title-style */,
                        }}
                    >
                        <AssignProductsGrid productCategoryId={productCategoryId} />
                    </DialogContent>
                    <DialogActions>
                        {/* TODO Missing close-dialog-unsaved-changes-check */}
                        <CancelButton onClick={handleCloseDialog} />
                        <SaveBoundarySaveButton disabled={false} />
                    </DialogActions>
                </Dialog>
            </SaveBoundary>
        </>
    );
}

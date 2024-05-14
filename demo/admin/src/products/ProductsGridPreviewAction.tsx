import { Tooltip } from "@comet/admin";
import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { GQLProductsListManualFragment } from "@src/products/ProductsGrid.generated";
import React from "react";
import { FormattedMessage } from "react-intl";

type Props = React.ComponentProps<typeof GridActionsCellItem> & {
    product: GQLProductsListManualFragment;
};

export const ProductsGridPreviewAction = ({ product, ...restProps }: Props) => {
    const [showDetails, setShowDetails] = React.useState(false);
    return (
        <>
            <Tooltip title="View Details">
                <GridActionsCellItem {...restProps} onClick={() => setShowDetails(true)} />
            </Tooltip>
            <Dialog open={showDetails} onClose={() => setShowDetails(false)}>
                <DialogTitle>
                    <FormattedMessage id="productsGrid.detailsDialog.title" defaultMessage="Product Details" />
                </DialogTitle>
                <DialogContent>
                    <Typography variant="h3" gutterBottom>
                        {product.title}
                    </Typography>
                    <Typography>{product.description}</Typography>
                </DialogContent>
            </Dialog>
        </>
    );
};

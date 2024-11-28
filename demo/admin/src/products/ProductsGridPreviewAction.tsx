import { Tooltip } from "@comet/admin";
import { View } from "@comet/admin-icons";
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { GridCellParams, GridValidRowModel } from "@mui/x-data-grid-pro";
import { GQLProductsGridFutureFragment } from "@src/products/future/generated/ProductsGrid.generated";
import { GQLProductsListManualFragment } from "@src/products/ProductsGrid.generated";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

type Props = GridCellParams<GridValidRowModel, GQLProductsListManualFragment | GQLProductsGridFutureFragment>;

export const ProductsGridPreviewAction = ({ row }: Props) => {
    const [showDetails, setShowDetails] = useState(false);
    return (
        <>
            <Tooltip title="View Details">
                <IconButton onClick={() => setShowDetails(true)}>
                    <View />
                </IconButton>
            </Tooltip>
            <Dialog open={showDetails} onClose={() => setShowDetails(false)}>
                <DialogTitle>
                    <FormattedMessage id="productsGrid.detailsDialog.title" defaultMessage="Product Details" />
                </DialogTitle>
                <DialogContent>
                    <Typography variant="h3" gutterBottom>
                        {row.title}
                    </Typography>
                    <Typography>{row.description}</Typography>
                </DialogContent>
            </Dialog>
        </>
    );
};

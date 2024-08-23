import { Tooltip } from "@comet/admin";
import { View } from "@comet/admin-icons";
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { GridCellParams } from "@mui/x-data-grid-pro";
import { GQLProductsGridFutureFragment } from "@src/products/future/generated/ProductsGrid.generated";
import { GQLProductsListManualFragment } from "@src/products/ProductsGrid.generated";
import React from "react";
import { FormattedMessage } from "react-intl";

type Props = GridCellParams<unknown, GQLProductsListManualFragment | GQLProductsGridFutureFragment>;

export const ProductsGridPreviewAction = ({ row }: Props) => {
    const [showDetails, setShowDetails] = React.useState(false);
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

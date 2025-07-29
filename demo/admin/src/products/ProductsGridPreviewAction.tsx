import { Tooltip } from "@comet/admin";
import { View } from "@comet/admin-icons";
import {
    // eslint-disable-next-line no-restricted-imports
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
} from "@mui/material";
import { type GridCellParams } from "@mui/x-data-grid-pro";
import { type GQLProductsGridFutureFragment } from "@src/products/generator/generated/ProductsGrid.generated";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import { type GQLProductsListManualFragment } from "./ProductsGrid.generated";

type Props = GridCellParams<GQLProductsListManualFragment | GQLProductsGridFutureFragment>;

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

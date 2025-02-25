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
import { type GridCellParams, type GridValidRowModel } from "@mui/x-data-grid-pro";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import { type GQLProductsFormFragment } from "./generated/ProductsGrid.generated";

type Props = GridCellParams<GridValidRowModel, GQLProductsFormFragment>;

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

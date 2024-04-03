import { Tooltip } from "@comet/admin";
import { View } from "@comet/admin-icons";
import { Box, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { GridRenderCellParams } from "@mui/x-data-grid-pro";
import React from "react";
import { FormattedMessage } from "react-intl";

type Props = {
    renderCellParams: GridRenderCellParams;
};

export const ProductsGridActions = ({ renderCellParams }: Props) => {
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
                    <FormattedMessage id="productsGrid.detailsDialog.title" defaultMessage="Product Details (JSON)" />
                </DialogTitle>
                <DialogContent>
                    <Box
                        component="pre"
                        sx={{
                            margin: 0,
                        }}
                    >
                        {JSON.stringify(renderCellParams.row, null, 2)}
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

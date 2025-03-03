import { gql, useApolloClient } from "@apollo/client";
import { Button, CancelButton, CrudMoreActionsMenuContext, Dialog } from "@comet/admin";
import { Online } from "@comet/admin-icons";
import { DialogActions, DialogContent, ListItemIcon, MenuItem } from "@mui/material";
import { useContext, useState } from "react";

import { GQLPublishAllProductsMutation, GQLPublishAllProductsMutationVariables } from "./PublishAllProducts.generated";

export function PublishAllProducts() {
    const [open, setOpen] = useState(false);
    const client = useApolloClient();
    const { closeMenu } = useContext(CrudMoreActionsMenuContext);

    const handlePublishAll = async () => {
        await client.mutate<GQLPublishAllProductsMutation, GQLPublishAllProductsMutationVariables>({
            mutation: gql`
                mutation PublishAllProducts {
                    publishAllProducts
                }
            `,
        });

        client.cache.evict({ fieldName: "products" });

        handleClose();
    };

    const handleClose = () => {
        setOpen(false);
        closeMenu();
    };

    return (
        <>
            <MenuItem
                onClick={() => {
                    setOpen(true);
                }}
            >
                <ListItemIcon>
                    <Online color="success" />
                </ListItemIcon>
                Publish all...
            </MenuItem>
            <Dialog open={open} onClose={handleClose} title="Publish all products?">
                <DialogContent>You are about to publish all products.</DialogContent>
                <DialogActions>
                    <CancelButton onClick={handleClose} />
                    <Button onClick={handlePublishAll} startIcon={<Online />} variant="success">
                        Publish
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

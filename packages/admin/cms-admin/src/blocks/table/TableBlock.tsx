import { OkayButton } from "@comet/admin";
import { Edit } from "@comet/admin-icons";
import { BlockCategory, BlockInterface, BlocksFinalForm, createBlockSkeleton, SelectPreviewComponent } from "@comet/blocks-admin";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import { TableBlockData, TableBlockInput } from "../../blocks.generated";
import { TableBlockGrid } from "./TableBlockGrid";
import { getInitialTableData } from "./utils";

export const TableBlock: BlockInterface<TableBlockData, TableBlockData, TableBlockInput> = {
    ...createBlockSkeleton(),
    defaultValues: () => getInitialTableData(),
    name: "Table",
    displayName: <FormattedMessage id="comet.blocks.table.displayName" defaultMessage="Table" />,
    category: BlockCategory.TextAndContent,
    AdminComponent: ({ state, updateState }) => {
        const [showDialog, setShowDialog] = useState(true);

        return (
            <SelectPreviewComponent>
                <BlocksFinalForm<TableBlockData> onSubmit={updateState} initialValues={state}>
                    <Button onClick={() => setShowDialog(true)} variant="contained" color="primary" startIcon={<Edit />}>
                        {/**
                         * TODO: Remove the need for this button:
                         * - The Dialog should open when navigating to the block
                         * - The Dialog should contain the Save-Button to save the data and close the Dialog
                         */}
                        <FormattedMessage id="comet.tableBlock.temporary.edit" defaultMessage="Edit table" />
                    </Button>
                    <Dialog open={showDialog} maxWidth="xl" onClose={() => setShowDialog(false)}>
                        <DialogTitle>
                            <FormattedMessage id="comet.blocks.table.displayName" defaultMessage="Table" />
                        </DialogTitle>
                        <TableBlockGrid state={state} updateState={updateState} />
                        <DialogActions>
                            <OkayButton onClick={() => setShowDialog(false)} />
                        </DialogActions>
                    </Dialog>
                </BlocksFinalForm>
            </SelectPreviewComponent>
        );
    },
};

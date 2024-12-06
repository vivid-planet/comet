import { OkayButton, useStackApi } from "@comet/admin";
import { BlockCategory, BlockInterface, BlocksFinalForm, createBlockSkeleton, SelectPreviewComponent } from "@comet/blocks-admin";
import { Dialog, DialogActions, DialogTitle } from "@mui/material";
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
        const stackApi = useStackApi();
        const [showDialog, setShowDialog] = useState(true);

        const closeTableBlock = () => {
            setShowDialog(false);
            stackApi?.goBack();
        };

        return (
            <SelectPreviewComponent>
                <BlocksFinalForm<TableBlockData> onSubmit={updateState} initialValues={state}>
                    <Dialog open={showDialog} maxWidth="xl" onClose={closeTableBlock}>
                        <DialogTitle>
                            <FormattedMessage id="comet.blocks.table.displayName" defaultMessage="Table" />
                        </DialogTitle>
                        <TableBlockGrid state={state} updateState={updateState} />
                        <DialogActions>
                            <OkayButton onClick={closeTableBlock} />
                        </DialogActions>
                    </Dialog>
                </BlocksFinalForm>
            </SelectPreviewComponent>
        );
    },
};

import { Dialog, OkayButton, useStackApi } from "@comet/admin";
import { DialogActions } from "@mui/material";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { type TableBlockData, type TableBlockInput } from "../../blocks.generated";
import { BlocksFinalForm } from "../form/BlocksFinalForm";
import { createBlockSkeleton } from "../helpers/createBlockSkeleton";
import { SelectPreviewComponent } from "../iframebridge/SelectPreviewComponent";
import { BlockCategory, type BlockInterface } from "../types";
import { TableBlockGrid } from "./TableBlockGrid";
import { getInitialTableData } from "./utils/getInitialTableData";

export const TableBlock: BlockInterface<TableBlockData, TableBlockData, TableBlockInput> = {
    ...createBlockSkeleton(),
    defaultValues: () => getInitialTableData(),
    name: "Table",
    displayName: <FormattedMessage id="comet.blocks.table.displayName" defaultMessage="Table" />,
    category: BlockCategory.TextAndContent,
    AdminComponent: ({ state, updateState }) => {
        const stackApi = useStackApi();
        const intl = useIntl();
        const [showDialog, setShowDialog] = useState(true);

        const closeTableBlock = () => {
            setShowDialog(false);
            stackApi?.goBack();
        };

        return (
            <SelectPreviewComponent>
                <BlocksFinalForm<TableBlockData> onSubmit={updateState} initialValues={state}>
                    <Dialog
                        open={showDialog}
                        maxWidth="xl"
                        onClose={closeTableBlock}
                        title={intl.formatMessage({ id: "comet.blocks.table.displayName", defaultMessage: "Table" })}
                        PaperProps={{ sx: { height: "100%", maxHeight: 880 } }}
                    >
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

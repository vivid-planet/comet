import { RowActionsItem, RowActionsMenu } from "@comet/admin";
import { Add, ArrowDown, ArrowUp, Copy, Delete, Duplicate, Paste, Remove } from "@comet/admin-icons";
import { Divider } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { TableBlockData } from "../../blocks.generated";

type Props = {
    row: TableBlockData["rows"][number];
};

export const ActionsCell = ({ row }: Props) => {
    return (
        <RowActionsMenu>
            <RowActionsMenu>
                <RowActionsItem
                    icon={row.highlighted ? <Remove /> : <Add />}
                    disabled
                    onClick={() => {
                        // TODO: Implement this
                    }}
                >
                    {row.highlighted ? (
                        <FormattedMessage id="comet.tableBlock.removeHighlighting" defaultMessage="Remove highlighting" />
                    ) : (
                        <FormattedMessage id="comet.tableBlock.highlightRow" defaultMessage="Highlight row" />
                    )}
                </RowActionsItem>
                <Divider />
                <RowActionsItem
                    icon={<ArrowUp />}
                    disabled
                    onClick={() => {
                        // TODO: Implement this
                    }}
                >
                    <FormattedMessage id="comet.tableBlock.addRowAbove" defaultMessage="Add row above" />
                </RowActionsItem>
                <RowActionsItem
                    icon={<ArrowDown />}
                    disabled
                    onClick={() => {
                        // TODO: Implement this
                    }}
                >
                    <FormattedMessage id="comet.tableBlock.addRowBelow" defaultMessage="Add row below" />
                </RowActionsItem>
                <Divider />
                <RowActionsItem
                    icon={<Copy />}
                    disabled
                    onClick={() => {
                        // TODO: Implement this
                    }}
                >
                    <FormattedMessage id="comet.tableBlock.copyRow" defaultMessage="Copy" />
                </RowActionsItem>
                <RowActionsItem
                    icon={<Paste />}
                    disabled
                    onClick={() => {
                        // TODO: Implement this
                    }}
                >
                    <FormattedMessage id="comet.tableBlock.pasteRow" defaultMessage="Paste" />
                </RowActionsItem>
                <RowActionsItem
                    icon={<Duplicate />}
                    disabled
                    onClick={() => {
                        // TODO: Implement this
                    }}
                >
                    <FormattedMessage id="comet.tableBlock.duplicateRow" defaultMessage="Duplicate" />
                </RowActionsItem>
                <Divider />
                <RowActionsItem icon={<Delete />}>
                    <FormattedMessage id="comet.tableBlock.deleteRow" defaultMessage="Delete" />
                </RowActionsItem>
            </RowActionsMenu>
        </RowActionsMenu>
    );
};

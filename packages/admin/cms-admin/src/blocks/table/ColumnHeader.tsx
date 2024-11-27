import { RowActionsItem, RowActionsMenu } from "@comet/admin";
import { Add, Copy, Delete, DensityStandard, DragIndicator, Duplicate, Paste, PinLeft, PinRight, Remove } from "@comet/admin-icons";
import { ButtonBase, Divider, styled } from "@mui/material";
import { GridColumnHeaderParams } from "@mui/x-data-grid";
import { ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { ColumnSize } from "./TableBlockGrid";

type Props = GridColumnHeaderParams & {
    columnSize: ColumnSize;
    highlighted: boolean;
};

const columnSizes: Record<ColumnSize, ReactNode> = {
    extraSmall: <FormattedMessage id="comet.tableBlock.columnSize.extraSmall" defaultMessage="Extra small" />,
    small: <FormattedMessage id="comet.tableBlock.columnSize.small" defaultMessage="Small" />,
    standard: <FormattedMessage id="comet.tableBlock.columnSize.standard" defaultMessage="Standard" />,
    large: <FormattedMessage id="comet.tableBlock.columnSize.large" defaultMessage="Large" />,
    extraLarge: <FormattedMessage id="comet.tableBlock.columnSize.extraLarge" defaultMessage="Extra large" />,
};

export const ColumnHeader = ({ columnSize, highlighted }: Props) => {
    return (
        <>
            <ColumnHeaderButton component="div" disableRipple>
                <DragIndicator />
            </ColumnHeaderButton>
            <RowActionsMenu>
                <RowActionsMenu>
                    <RowActionsMenu text="Column width" icon={<DensityStandard />}>
                        {Object.entries(columnSizes).map(([size, label]) => (
                            <RowActionsItem
                                key={size}
                                disabled
                                onClick={() => {
                                    // TODO: Implement this
                                }}
                                componentsProps={{ menuItem: { selected: columnSize === size } }}
                            >
                                {label}
                            </RowActionsItem>
                        ))}
                    </RowActionsMenu>
                    <RowActionsItem
                        icon={highlighted ? <Remove /> : <Add />}
                        disabled
                        onClick={() => {
                            // TODO: Implement this
                        }}
                    >
                        {highlighted ? "Remove highlighting" : "Highlight column"}
                    </RowActionsItem>
                    <Divider />
                    <RowActionsItem
                        icon={<PinLeft />}
                        disabled
                        onClick={() => {
                            // TODO: Implement this
                        }}
                    >
                        <FormattedMessage id="comet.tableBlock.insertColumnLeft" defaultMessage="Insert column left" />
                    </RowActionsItem>
                    <RowActionsItem
                        icon={<PinRight />}
                        disabled
                        onClick={() => {
                            // TODO: Implement this
                        }}
                    >
                        <FormattedMessage id="comet.tableBlock.insertColumnRight" defaultMessage="Insert column right" />
                    </RowActionsItem>
                    <Divider />
                    <RowActionsItem
                        icon={<Copy />}
                        disabled
                        onClick={() => {
                            // TODO: Implement this
                        }}
                    >
                        <FormattedMessage id="comet.tableBlock.copyColumn" defaultMessage="Copy" />
                    </RowActionsItem>
                    <RowActionsItem
                        icon={<Paste />}
                        disabled
                        onClick={() => {
                            // TODO: Implement this
                        }}
                    >
                        <FormattedMessage id="comet.tableBlock.pasteColumn" defaultMessage="Paste" />
                    </RowActionsItem>
                    <RowActionsItem
                        icon={<Duplicate />}
                        disabled
                        onClick={() => {
                            // TODO: Implement this
                        }}
                    >
                        <FormattedMessage id="comet.tableBlock.duplicateColumn" defaultMessage="Duplicate" />
                    </RowActionsItem>
                    <Divider />
                    <RowActionsItem
                        icon={<Delete />}
                        disabled
                        onClick={() => {
                            // TODO: Implement this
                        }}
                    >
                        <FormattedMessage id="comet.tableBlock.deleteColumn" defaultMessage="Delete" />
                    </RowActionsItem>
                </RowActionsMenu>
            </RowActionsMenu>
        </>
    );
};

// TODO: Explain this comment better??
// Workaround: When a button is rendered inside the ColumnHeader (e.g. RowActionsItem), only buttons can be used for column reordering
const ColumnHeaderButton = styled(ButtonBase)(({ theme }) => ({
    position: "absolute",
    inset: 0,
    cursor: "move",
    justifyContent: "flex-start",
    paddingLeft: theme.spacing(2),
})) as typeof ButtonBase;

import { messages } from "@comet/admin";
import { Account } from "@comet/admin-icons";
import { createBlocksBlock, Space as SpaceBlock, YouTubeVideoBlock } from "@comet/blocks-admin";
import { DamImageBlock, DamVideoBlock } from "@comet/cms-admin";
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, ListItemIcon, MenuItem, Select } from "@mui/material";
import { LinkListBlock } from "@src/common/blocks/LinkListBlock";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { ColumnsBlock } from "./blocks/ColumnsBlock";
import { FullWidthImageBlock } from "./blocks/FullWidthImageBlock";
import { HeadlineBlock } from "./blocks/HeadlineBlock";
import { TextImageBlock } from "./blocks/TextImageBlock";

const userGroupOptions = [
    {
        label: <FormattedMessage id="cometDemo.pageContentBlock.userGroupOptions.All" defaultMessage="Show for all" />,
        value: "All",
    },
    {
        label: <FormattedMessage id="cometDemo.pageContentBlock.userGroupOptions.User" defaultMessage="Show only for group: User" />,
        value: "User",
    },
    {
        label: <FormattedMessage id="cometDemo.pageContentBlock.userGroupOptions.Admin" defaultMessage="Show only for group: Admin" />,
        value: "Admin",
    },
];

export const PageContentBlock = createBlocksBlock({
    name: "PageContent",
    supportedBlocks: {
        space: SpaceBlock,
        richtext: RichTextBlock,
        headline: HeadlineBlock,
        image: DamImageBlock,
        textImage: TextImageBlock,
        damVideo: DamVideoBlock,
        youTubeVideo: YouTubeVideoBlock,
        linkList: LinkListBlock,
        fullWidthImage: FullWidthImageBlock,
        columns: ColumnsBlock,
    },
    additionalFields: {
        userGroup: {
            defaultValue: "All",
        },
    },
    AdditionalContextMenuItems: ({ block, onChange, onMenuClose }) => {
        const [internalValue, setInternalValue] = React.useState(block.userGroup);
        const [dialogOpen, setDialogOpen] = React.useState(false);
        return (
            <>
                <MenuItem
                    onClick={() => {
                        setDialogOpen(true);
                    }}
                >
                    <ListItemIcon>
                        <Account />
                    </ListItemIcon>
                    <FormattedMessage id="cometDemo.pageContentBlock.userGroup.menuItem" defaultMessage="Visibility rules" />
                </MenuItem>
                <Dialog
                    open={dialogOpen}
                    onClose={() => {
                        setDialogOpen(false);
                        onMenuClose();
                    }}
                >
                    <DialogTitle>
                        <FormattedMessage id="cometDemo.pageContentBlock.userGroup.dialogTitle" defaultMessage="Visibility rules" />
                    </DialogTitle>
                    <DialogContent>
                        <Select value={internalValue} onChange={(event) => setInternalValue(event.target.value)} fullWidth>
                            {userGroupOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setDialogOpen(false);
                                onMenuClose();
                            }}
                        >
                            <FormattedMessage {...messages.cancel} />
                        </Button>
                        <Button
                            onClick={() => {
                                onChange({ ...block, userGroup: internalValue });
                                setDialogOpen(false);
                                onMenuClose();
                            }}
                        >
                            <FormattedMessage {...messages.ok} />
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    },
    AdditionalBlockRowContent: ({ block }) => {
        if (block.userGroup === "All") {
            return null;
        } else {
            return <Chip label={userGroupOptions.find((option) => option.value === block.userGroup)?.label} />;
        }
    },
});

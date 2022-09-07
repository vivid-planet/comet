import { Field, FinalFormSelect, messages } from "@comet/admin";
import { Account } from "@comet/admin-icons";
import { createBlocksBlock, Space as SpaceBlock, YouTubeVideoBlock } from "@comet/blocks-admin";
import { DamImageBlock, DamVideoBlock } from "@comet/cms-admin";
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, ListItemIcon, MenuItem } from "@mui/material";
import { LinkListBlock } from "@src/common/blocks/LinkListBlock";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import { GQLUserGroup } from "@src/graphql.generated";
import * as React from "react";
import { Form } from "react-final-form";
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
        const [dialogOpen, setDialogOpen] = React.useState(false);

        interface FormValues {
            userGroup: GQLUserGroup;
        }

        const handleSubmit = (values: FormValues) => {
            onChange({ ...block, userGroup: values.userGroup });
            setDialogOpen(false);
            onMenuClose();
        };

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
                    <Form<FormValues> onSubmit={handleSubmit} initialValues={{ userGroup: block.userGroup as GQLUserGroup }}>
                        {({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <DialogContent>
                                    <Field name="userGroup" fullWidth required>
                                        {(props) => (
                                            <FinalFormSelect {...props}>
                                                {userGroupOptions.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </FinalFormSelect>
                                        )}
                                    </Field>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            setDialogOpen(false);
                                            onMenuClose();
                                        }}
                                    >
                                        <FormattedMessage {...messages.cancel} />
                                    </Button>
                                    <Button type="submit">
                                        <FormattedMessage {...messages.ok} />
                                    </Button>
                                </DialogActions>
                            </form>
                        )}
                    </Form>
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

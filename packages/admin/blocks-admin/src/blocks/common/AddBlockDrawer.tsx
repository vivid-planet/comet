import { useStoredState } from "@comet/admin";
import { Close, Dashboard, Search } from "@comet/admin-icons";
import {
    Checkbox,
    DialogContent,
    DialogTitle,
    Drawer,
    FormControlLabel,
    IconButton,
    InputAdornment,
    InputBase,
    List,
    ListItem,
    ListItemIcon,
    Paper,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage, MessageDescriptor, useIntl } from "react-intl";

import { BlockCategory, blockCategoryLabels, BlockInterface } from "../types";

type BlockType = string;

interface Category {
    id: string;
    label: React.ReactNode;
    blocks: Array<[BlockType, BlockInterface]>;
}

interface Props {
    open: boolean;
    onClose: () => void;
    blocks: Record<string, BlockInterface>;
    onAddNewBlock: (type: string, addAndEdit: boolean) => void;
}

export function AddBlockDrawer({ open, onClose, blocks, onAddNewBlock }: Props): React.ReactElement {
    const intl = useIntl();
    const [searchValue, setSearchValue] = React.useState("");
    const [addAndEdit, setAddAndEdit] = useStoredState<boolean>("addAndEdit", true);

    const categories = React.useMemo(() => {
        const categories: Category[] = [];
        const categoriesOrder = Object.keys(BlockCategory);

        for (const [type, block] of Object.entries(blocks)) {
            let blockName: string;

            if (typeof block.displayName === "string") {
                blockName = block.displayName;
            } else if (isFormattedMessage(block.displayName)) {
                blockName = intl.formatMessage(block.displayName.props);
            } else {
                throw new TypeError("Block displayName must be either a string or a FormattedMessage");
            }

            if (!blockName.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())) {
                continue;
            }

            let id: string;
            let label: React.ReactNode;

            if (typeof block.category === "object") {
                if (typeof block.category.label === "string") {
                    id = block.category.label;
                    label = block.category.label;
                } else if (isFormattedMessage(block.category.label)) {
                    id = intl.formatMessage(block.category.label.props);
                    label = block.category.label;
                } else {
                    throw new TypeError("Custom category label must be either a string or a FormattedMessage");
                }

                if (block.category.insertBefore) {
                    const insertBeforeIndex = categoriesOrder.indexOf(block.category.insertBefore);
                    categoriesOrder.splice(insertBeforeIndex, 0, id);
                } else {
                    categoriesOrder.push(id);
                }
            } else {
                id = block.category;
                label = blockCategoryLabels[block.category];
            }

            let category = categories.find((category) => category.id === id);

            if (!category) {
                category = { id, label, blocks: [] };
                categories.push(category);
            }

            category.blocks.push([type, block]);
        }

        categories.sort((a, b) => categoriesOrder.indexOf(a.id) - categoriesOrder.indexOf(b.id));

        return categories;
    }, [intl, blocks, searchValue]);

    const handleListItemClick = (type: string) => {
        onAddNewBlock(type, addAndEdit);
        onClose();
    };

    const handleSearchFieldChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setSearchValue(event.target.value);
    };

    const handleSearchFieldKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
        const hasSearchResults = categories.length > 0 && categories[0].blocks.length > 0;

        if (event.key === "Enter" && hasSearchResults) {
            const firstBlockInList = categories[0].blocks[0];
            const [blockType] = firstBlockInList;
            handleListItemClick(blockType);
        }
    };

    const handleAddAndEditChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setAddAndEdit(event.target.checked);
    };

    return (
        <Drawer open={open} onClose={onClose} anchor="right">
            <Header>
                <FormattedMessage id="comet.blocks.drawer.header" defaultMessage="Add new block" />
                <IconButton onClick={onClose} sx={{ color: (theme) => theme.palette.common.white }} size="large">
                    <Close />
                </IconButton>
            </Header>
            <Content>
                <ContentItem>
                    <InputItem>
                        <InputBase
                            fullWidth
                            autoFocus
                            placeholder={intl.formatMessage({ id: "comet.blocks.drawer.searchField.placeholder", defaultMessage: "Search..." })}
                            startAdornment={
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            }
                            onChange={handleSearchFieldChange}
                            onKeyDown={handleSearchFieldKeyDown}
                            value={searchValue}
                        />
                    </InputItem>
                    <InputItem>
                        <FormControlLabel
                            control={<Checkbox checked={addAndEdit} onChange={handleAddAndEditChange} color="primary" />}
                            label={<FormattedMessage id="comet.blocks.drawer.addAndEdit" defaultMessage="add + edit" />}
                        />
                    </InputItem>
                </ContentItem>
                {categories.map((category) => {
                    if (category.blocks.length === 0) {
                        return null;
                    }

                    return (
                        <ContentItem key={category.id}>
                            <Typography variant="h4" gutterBottom>
                                {category.label}
                            </Typography>
                            <Paper elevation={0}>
                                <List disablePadding>
                                    {category.blocks.map(([type, block]) => (
                                        <ListItem key={type} dense={false} button divider onClick={() => handleListItemClick(type)}>
                                            <ListItemIcon>
                                                <Dashboard />
                                            </ListItemIcon>
                                            {block.displayName}
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </ContentItem>
                    );
                })}
            </Content>
        </Drawer>
    );
}

function isFormattedMessage(node: React.ReactNode): node is React.ReactElement<MessageDescriptor> {
    return React.isValidElement(node) && node.type === FormattedMessage;
}

const Content = styled(DialogContent)`
    width: 380px;
`;

const Header = styled(DialogTitle)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    padding-left: 20px;
`;

const ContentItem = styled("div")`
    &:not(:last-child) {
        margin-bottom: 40px;
    }
`;

const InputItem = styled("div")`
    margin-bottom: 10px;
`;

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
} from "@material-ui/core";
import * as React from "react";
import { FormattedMessage, MessageDescriptor, useIntl } from "react-intl";
import styled from "styled-components";

import { BlockCategory, blockCategoryLabels, BlockInterface } from "../types";

type BlockType = string;

interface Category {
    blockCategory: BlockCategory;
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
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [searchValue, setSearchValue] = React.useState("");
    const [addAndEdit, setAddAndEdit] = useStoredState<boolean>("addAndEdit", true);

    React.useEffect(() => {
        setCategories(
            (Object.keys(BlockCategory) as BlockCategory[]).map((currentBlockCategory) => {
                const blocksForCategory = Object.entries(blocks).filter(([, block]) => {
                    const formattedDisplayName =
                        typeof block.displayName === "string"
                            ? (block.displayName as string)
                            : intl.formatMessage((block.displayName as React.ReactElement<MessageDescriptor>).props);

                    return (
                        block.category === currentBlockCategory && formattedDisplayName.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
                    );
                });

                return { blockCategory: currentBlockCategory, label: blockCategoryLabels[currentBlockCategory], blocks: blocksForCategory };
            }),
        );
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
            <Header disableTypography>
                <Typography variant="body2" color="inherit">
                    <FormattedMessage id="comet.blocks.drawer.header" defaultMessage="Add new block" />
                </Typography>
                <IconButton onClick={onClose} color="inherit">
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
                        <ContentItem key={category.blockCategory}>
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

const ContentItem = styled.div`
    &:not(:last-child) {
        margin-bottom: 40px;
    }
`;

const InputItem = styled.div`
    margin-bottom: 10px;
`;

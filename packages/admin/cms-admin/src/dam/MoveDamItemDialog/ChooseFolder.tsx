import { useApolloClient } from "@apollo/client";
import { ArrowRight, PageTree, TreeCollapse, TreeExpand } from "@comet/admin-icons";
import { List, ListItem, SvgIconProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { FormattedMessage } from "react-intl";

import { GQLChooseFolderFoldersQuery, GQLChooseFolderFoldersQueryVariables } from "../../graphql.generated";
import { traversePreOrder, TreeMap } from "../../pages/pageTree/treemap/TreeMapUtils";
import { foldersQuery } from "./ChooseFolder.gql";

interface Folder {
    id: string;
    name: string;
    parentId: string | null;
    hasChildren: boolean;
}

export const ChooseFolder = () => {
    const apolloClient = useApolloClient();

    const [folderTree, setFolderTree] = React.useState<TreeMap<Folder>>(new TreeMap<Folder>());
    const [expandedIds, setExpandedIds] = React.useState<string[]>([]);
    const [visibleNodes, setVisibleNodes] = React.useState<Array<{ element: Folder; level: number }>>([]);
    const [loadingChildrenOfIds, setLoadingChildrenOfIds] = React.useState<string[]>([]);

    const [chosenId, setChosenId] = React.useState<string | null>();

    const loadChildFolder = async (id: string | null) => {
        setLoadingChildrenOfIds((ids) => {
            if (id !== null) {
                return [...ids, id];
            }
            return ids;
        });

        const { data } = await apolloClient.query<GQLChooseFolderFoldersQuery, GQLChooseFolderFoldersQueryVariables>({
            query: foldersQuery,
            variables: {
                parentId: id,
            },
        });

        setLoadingChildrenOfIds((ids) => ids.filter((loadingId) => loadingId !== id));

        const folders = data.damFolders.map((folder) => {
            return { id: folder.id, name: folder.name, parentId: folder.parent?.id ?? null, hasChildren: folder.numberOfChildFolders > 0 };
        });

        setFolderTree((existingTreeMap) => {
            const newTreeMap = new TreeMap(existingTreeMap);
            newTreeMap.set(id ?? "root", folders);

            return newTreeMap;
        });
    };

    React.useEffect(() => {
        loadChildFolder(null);

        // This useEffect is for initially loading all folders on level 1
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const internalVisibleNodes: Array<{ element: Folder; level: number }> = [];

        traversePreOrder(folderTree, (element, level) => {
            const parentIsVisible =
                element.parentId !== null ? internalVisibleNodes.find((otherNode) => otherNode.element.id === element.parentId) : true;
            const parentIsExpanded = element.parentId !== null ? expandedIds.includes(element.parentId) : true;

            if (parentIsVisible && parentIsExpanded) {
                internalVisibleNodes.push({ element, level });
            }
        });

        setVisibleNodes(internalVisibleNodes);
    }, [expandedIds, folderTree]);

    return (
        <List>
            <ChooseFolderItem
                Icon={PageTree}
                message={<FormattedMessage id="comet.pages.dam.assetManager" defaultMessage="Asset Manager" />}
                offset={20}
                isChosen={chosenId === null}
                onClick={() => {
                    setChosenId(null);
                }}
            />
            {visibleNodes.map(({ element: folder, level }) => {
                return (
                    <>
                        <ChooseFolderItem
                            key={folder.id}
                            Icon={folder.hasChildren ? (expandedIds.includes(folder.id) ? TreeCollapse : TreeExpand) : undefined}
                            onIconClick={() => {
                                if (expandedIds.includes(folder.id)) {
                                    setExpandedIds((expandedIds) => expandedIds.filter((id) => id !== folder.id));
                                } else {
                                    setExpandedIds((expandedIds) => [...expandedIds, folder.id]);

                                    if (!folderTree.has(folder.id)) {
                                        loadChildFolder(folder.id);
                                    }
                                }
                            }}
                            message={folder.name}
                            offset={20 + 36 * level}
                            isChosen={chosenId === folder.id}
                            onClick={() => {
                                setChosenId(folder.id);
                            }}
                        />
                        {loadingChildrenOfIds.includes(folder.id) && (
                            <ChooseFolderItem
                                message={<FormattedMessage id="comet.dam.chooseFolder.loading" defaultMessage="Loading ..." />}
                                offset={20 + 36 * (level + 1)}
                            />
                        )}
                    </>
                );
            })}
        </List>
    );
};

const StyledListItem = styled(ListItem)<{ offset: number; isChosen: boolean }>`
    display: flex;
    justify-content: space-between;

    height: 56px;
    background: white;
    cursor: pointer;
    padding-left: ${({ offset }) => offset}px;

    border-left: solid 2px transparent;
    border-right: solid 2px transparent;
    border-bottom: solid 1px ${({ theme }) => theme.palette.grey[100]};

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        border-left: solid 2px ${({ theme }) => theme.palette.primary.main};
        border-right: solid 2px ${({ theme }) => theme.palette.primary.main};
        background: ${({ theme }) => theme.palette.grey[50]};
    }

    ${({ isChosen, theme }) => {
        return isChosen
            ? `
                border-top: solid 2px ${theme.palette.primary.main};
                border-bottom: solid 2px ${theme.palette.primary.main};
                border-left: solid 2px ${theme.palette.primary.main};
                border-right: solid 2px ${theme.palette.primary.main};
                
                &:last-child {
                    border-bottom: solid 2px ${theme.palette.primary.main};
                }
            `
            : null;
    }}
`;

interface ChooseFolderItemProps {
    Icon?: React.ComponentType<SvgIconProps>;
    onIconClick?: () => void;
    onClick?: () => void;
    message: React.ReactNode;
    offset: number;
    isChosen?: boolean;
}
const ChooseFolderItem = ({ Icon, onIconClick, onClick, message, offset, isChosen = false }: ChooseFolderItemProps) => {
    return (
        <StyledListItem offset={Icon ? offset : offset + 20 + 16} isChosen={isChosen} onClick={onClick}>
            <div>
                {Icon && (
                    <Icon
                        sx={{ marginRight: "20px" }}
                        onClick={(event) => {
                            event.stopPropagation();
                            onIconClick?.();
                        }}
                    />
                )}{" "}
                {message}
            </div>
            <ArrowRight />
        </StyledListItem>
    );
};

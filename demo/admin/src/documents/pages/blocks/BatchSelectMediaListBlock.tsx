import { gql, useApolloClient } from "@apollo/client";
import { Add } from "@comet/admin-icons";
import {
    BlockAdminComponentButton,
    BlockCategory,
    type BlockState,
    ChooseFilesDialog,
    createCompositeBlock,
    createListBlock,
    damFileFieldFragment,
    DamImageBlock,
    DamVideoBlock,
    type GQLDamFileFieldFileFragment,
    HiddenInSubroute,
    type ListBlockState,
    PixelImageBlock,
    SvgImageBlock,
    useDamAcceptedMimeTypes,
} from "@comet/cms-admin";
import { type ReactNode, useState } from "react";
import { FormattedMessage } from "react-intl";
import { v4 as uuid } from "uuid";

const batchSelectMediaListFileQuery = gql`
    query BatchSelectMediaListFile($id: ID!) {
        damFile(id: $id) {
            ...DamFileFieldFile
        }
    }
    ${damFileFieldFragment}
`;

interface BatchSelectMediaListFileQueryResult {
    damFile: GQLDamFileFieldFileFragment;
}

interface BatchSelectMediaListFileQueryVariables {
    id: string;
}

const buildListEntry = <Props,>(props: Props) => ({
    key: uuid(),
    visible: true,
    props,
    selected: false,
    slideIn: false,
});

const ChooseFromDamButton = ({
    label,
    allowedMimetypes,
    onChoose,
}: {
    label: ReactNode;
    allowedMimetypes: string[];
    onChoose: (files: GQLDamFileFieldFileFragment[]) => void;
}) => {
    const apolloClient = useApolloClient();
    const [open, setOpen] = useState(false);

    const handleConfirm = async (fileIds: string[]) => {
        const files = await Promise.all(
            fileIds.map(async (id) => {
                const { data } = await apolloClient.query<BatchSelectMediaListFileQueryResult, BatchSelectMediaListFileQueryVariables>({
                    query: batchSelectMediaListFileQuery,
                    variables: { id },
                });
                return data.damFile;
            }),
        );

        onChoose(files);
        setOpen(false);
    };

    return (
        <>
            <BlockAdminComponentButton startIcon={<Add />} variant="primary" onClick={() => setOpen(true)} size="large">
                {label}
            </BlockAdminComponentButton>
            <ChooseFilesDialog
                open={open}
                onClose={() => setOpen(false)}
                onConfirm={handleConfirm}
                initialFileIds={[]}
                allowedMimetypes={allowedMimetypes}
            />
        </>
    );
};

const BatchSelectMediaListImageListBlock = createListBlock(
    {
        name: "BatchSelectMediaListImageList",
        block: DamImageBlock,
        itemName: <FormattedMessage id="batchSelectMediaListBlock.imageList.itemName" defaultMessage="image" />,
        itemsName: <FormattedMessage id="batchSelectMediaListBlock.imageList.itemsName" defaultMessage="images" />,
    },
    (block) => {
        const OriginalAdminComponent = block.AdminComponent;

        block.AdminComponent = function BatchSelectMediaListImageListAdminComponent({ state, updateState }) {
            const damMimeTypes = useDamAcceptedMimeTypes();

            return (
                <>
                    <OriginalAdminComponent state={state} updateState={updateState} />
                    <HiddenInSubroute>
                        <ChooseFromDamButton
                            label={
                                <FormattedMessage id="batchSelectMediaListBlock.imageList.addMultipleImages" defaultMessage="Add multiple images" />
                            }
                            allowedMimetypes={[
                                ...damMimeTypes.filteredAcceptedMimeTypes.pixelImage,
                                ...damMimeTypes.filteredAcceptedMimeTypes.svgImage,
                            ]}
                            onChoose={(files) => {
                                const newEntries = files.map((file) => {
                                    const type = damMimeTypes.filteredAcceptedMimeTypes.pixelImage.includes(file.mimetype)
                                        ? "pixelImage"
                                        : "svgImage";
                                    const subBlock = type === "pixelImage" ? PixelImageBlock : SvgImageBlock;
                                    const props = {
                                        activeType: type,
                                        attachedBlocks: [
                                            {
                                                type,
                                                props: { ...subBlock.defaultValues(), damFile: file },
                                            },
                                        ],
                                    } as BlockState<typeof DamImageBlock>;
                                    return buildListEntry(props);
                                });

                                updateState((prev: ListBlockState<typeof DamImageBlock>) => ({
                                    ...prev,
                                    blocks: [...prev.blocks, ...newEntries],
                                }));
                            }}
                        />
                    </HiddenInSubroute>
                </>
            );
        };

        return block;
    },
);

const BatchSelectMediaListVideoListBlock = createListBlock(
    {
        name: "BatchSelectMediaListVideoList",
        block: DamVideoBlock,
        itemName: <FormattedMessage id="batchSelectMediaListBlock.videoList.itemName" defaultMessage="video" />,
        itemsName: <FormattedMessage id="batchSelectMediaListBlock.videoList.itemsName" defaultMessage="videos" />,
    },
    (block) => {
        const OriginalAdminComponent = block.AdminComponent;

        block.AdminComponent = function BatchSelectMediaListVideoListAdminComponent({ state, updateState }) {
            return (
                <>
                    <OriginalAdminComponent state={state} updateState={updateState} />
                    <HiddenInSubroute>
                        <ChooseFromDamButton
                            label={
                                <FormattedMessage id="batchSelectMediaListBlock.videoList.addMultipleVideos" defaultMessage="Add multiple videos" />
                            }
                            allowedMimetypes={["video/mp4", "video/webm"]}
                            onChoose={(files) => {
                                const newEntries = files.map((file) => {
                                    const props = {
                                        ...DamVideoBlock.defaultValues(),
                                        damFile: file,
                                    } as BlockState<typeof DamVideoBlock>;
                                    return buildListEntry(props);
                                });

                                updateState((prev: ListBlockState<typeof DamVideoBlock>) => ({
                                    ...prev,
                                    blocks: [...prev.blocks, ...newEntries],
                                }));
                            }}
                        />
                    </HiddenInSubroute>
                </>
            );
        };

        return block;
    },
);

export const BatchSelectMediaListBlock = createCompositeBlock(
    {
        name: "BatchSelectMediaList",
        displayName: <FormattedMessage id="batchSelectMediaListBlock.displayName" defaultMessage="Batch Select Media List" />,
        blocks: {
            images: {
                block: BatchSelectMediaListImageListBlock,
                title: <FormattedMessage id="batchSelectMediaListBlock.images" defaultMessage="Images" />,
            },
            videos: {
                block: BatchSelectMediaListVideoListBlock,
                title: <FormattedMessage id="batchSelectMediaListBlock.videos" defaultMessage="Videos" />,
            },
        },
    },
    (block) => {
        block.category = BlockCategory.Media;
        return block;
    },
);

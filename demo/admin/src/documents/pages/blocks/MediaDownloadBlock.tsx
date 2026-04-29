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

const mediaDownloadFileQuery = gql`
    query MediaDownloadFile($id: ID!) {
        damFile(id: $id) {
            ...DamFileFieldFile
        }
    }
    ${damFileFieldFragment}
`;

interface MediaDownloadFileQueryResult {
    damFile: GQLDamFileFieldFileFragment;
}

interface MediaDownloadFileQueryVariables {
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
                const { data } = await apolloClient.query<MediaDownloadFileQueryResult, MediaDownloadFileQueryVariables>({
                    query: mediaDownloadFileQuery,
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

const MediaDownloadImageListBlock = createListBlock(
    {
        name: "MediaDownloadImageList",
        block: DamImageBlock,
        itemName: <FormattedMessage id="mediaDownloadBlock.imageList.itemName" defaultMessage="image" />,
        itemsName: <FormattedMessage id="mediaDownloadBlock.imageList.itemsName" defaultMessage="images" />,
    },
    (block) => {
        const OriginalAdminComponent = block.AdminComponent;

        block.AdminComponent = function MediaDownloadImageListAdminComponent({ state, updateState }) {
            const damMimeTypes = useDamAcceptedMimeTypes();

            return (
                <>
                    <OriginalAdminComponent state={state} updateState={updateState} />
                    <HiddenInSubroute>
                        <ChooseFromDamButton
                            label={<FormattedMessage id="mediaDownloadBlock.imageList.addMultipleImages" defaultMessage="Add multiple images" />}
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

const MediaDownloadVideoListBlock = createListBlock(
    {
        name: "MediaDownloadVideoList",
        block: DamVideoBlock,
        itemName: <FormattedMessage id="mediaDownloadBlock.videoList.itemName" defaultMessage="video" />,
        itemsName: <FormattedMessage id="mediaDownloadBlock.videoList.itemsName" defaultMessage="videos" />,
    },
    (block) => {
        const OriginalAdminComponent = block.AdminComponent;

        block.AdminComponent = function MediaDownloadVideoListAdminComponent({ state, updateState }) {
            return (
                <>
                    <OriginalAdminComponent state={state} updateState={updateState} />
                    <HiddenInSubroute>
                        <ChooseFromDamButton
                            label={<FormattedMessage id="mediaDownloadBlock.videoList.addMultipleVideos" defaultMessage="Add multiple videos" />}
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

export const MediaDownloadBlock = createCompositeBlock(
    {
        name: "MediaDownload",
        displayName: <FormattedMessage id="mediaDownloadBlock.displayName" defaultMessage="Media Download" />,
        blocks: {
            images: {
                block: MediaDownloadImageListBlock,
                title: <FormattedMessage id="mediaDownloadBlock.images" defaultMessage="Images" />,
            },
            videos: {
                block: MediaDownloadVideoListBlock,
                title: <FormattedMessage id="mediaDownloadBlock.videos" defaultMessage="Videos" />,
            },
        },
    },
    (block) => {
        block.category = BlockCategory.Media;
        return block;
    },
);

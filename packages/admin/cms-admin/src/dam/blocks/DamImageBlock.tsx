import { Field } from "@comet/admin";
import { BlockCategory, BlockInterface, BlocksFinalForm, createOneOfBlock, resolveNewState } from "@comet/blocks-admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { PixelImageBlockData, SvgImageBlockData } from "../../blocks.generated";
import { PixelImageBlock } from "../../blocks/PixelImageBlock";
import { SvgImageBlock } from "../../blocks/SvgImageBlock";
import { FileField } from "../../form/file/FileField";
import { GQLDamFileFieldFileFragment } from "../../graphql.generated";
import { useDamAcceptedMimeTypes } from "../config/useDamAcceptedMimeTypes";

const supportedBlocks: Record<string, BlockInterface> = {
    pixelImage: PixelImageBlock,
    svgImage: SvgImageBlock,
};

const DamImageBlock = createOneOfBlock({
    name: "DamImage",
    displayName: <FormattedMessage id="comet.blocks.damImage" defaultMessage="Image" />,
    category: BlockCategory.Media,
    supportedBlocks,
    allowEmpty: false,
});

// Custom Admin component to improve the image selection UX.
// Allows selecting both pixel and SVG images and "chooses" the correct supported block.
DamImageBlock.AdminComponent = function AdminComponent({ state, updateState }) {
    const { filteredAcceptedMimeTypes } = useDamAcceptedMimeTypes();

    if (state.activeType === null) {
        throw new Error("No active type");
    }

    const activeBlock = state.attachedBlocks.find((block) => block.type === state.activeType);

    if (activeBlock === undefined) {
        throw new Error(`No block found for type ${state.activeType}`);
    }

    const isEmpty = (activeBlock.props as PixelImageBlockData | SvgImageBlockData).damFile === undefined;

    if (isEmpty) {
        return (
            <BlocksFinalForm<{ damFile?: GQLDamFileFieldFileFragment }>
                onSubmit={({ damFile }) => {
                    if (damFile === undefined) {
                        return;
                    }

                    const type = filteredAcceptedMimeTypes.pixelImage.includes(damFile.mimetype) ? "pixelImage" : "svgImage";

                    updateState({
                        attachedBlocks: [
                            {
                                type,
                                props: {
                                    damFile,
                                },
                            },
                        ],
                        activeType: type,
                    });
                }}
                initialValues={{}}
            >
                <Field
                    name="damFile"
                    component={FileField}
                    fullWidth
                    buttonText={<FormattedMessage id="comet.blocks.image.chooseImage" defaultMessage="Choose image" />}
                    allowedMimetypes={[...filteredAcceptedMimeTypes.pixelImage, ...filteredAcceptedMimeTypes.svgImage]}
                />
            </BlocksFinalForm>
        );
    } else {
        const AdminComponent = supportedBlocks[state.activeType].AdminComponent;

        return (
            <AdminComponent
                state={activeBlock.props}
                updateState={(setStateAction) => {
                    updateState({
                        attachedBlocks: [
                            {
                                type: activeBlock.type,
                                props: resolveNewState({ prevState: activeBlock.props, setStateAction }),
                            },
                        ],
                        activeType: activeBlock.type,
                    });
                }}
            />
        );
    }
};

// Disable dynamic display name. Would display "SVG" for a selected SVG image, but we want to always display "Image".
DamImageBlock.dynamicDisplayName = undefined;

export { DamImageBlock };

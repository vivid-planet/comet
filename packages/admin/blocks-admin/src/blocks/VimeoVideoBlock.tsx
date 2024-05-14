import { Field, FinalFormInput, FinalFormSwitch } from "@comet/admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { VimeoVideoBlockData } from "../blocks.generated";
import { BlocksFinalForm } from "../form/BlocksFinalForm";
import { createCompositeBlock } from "./factories/createCompositeBlock";
import { createCompositeSettings } from "./helpers/composeBlocks/createCompositeSettings";
import { BlockCategory } from "./types";

export const VimeoVideoBlock = createCompositeBlock(
    {
        name: "VimeoVideo",
        displayName: <FormattedMessage id="blocks.vimeoVideo" defaultMessage="Video (Vimeo)" />,
        category: BlockCategory.Media,
        blocks: {
            settings: {
                block: createCompositeSettings<Pick<VimeoVideoBlockData, "vimeoIdentifier" | "autoplay">>({
                    defaultValues: { vimeoIdentifier: "", autoplay: false },
                    AdminComponent: ({ state, updateState }) => {
                        return (
                            <BlocksFinalForm onSubmit={updateState} initialValues={state}>
                                <Field
                                    name="vimeoIdentifier"
                                    label={<FormattedMessage id="blocks.vimeoVideo.vimeoIdentifier" defaultMessage="Vimeo URL or Vimeo Video ID" />}
                                    type="text"
                                    component={FinalFormInput}
                                    fullWidth
                                />

                                <Field
                                    name="autoplay"
                                    label={<FormattedMessage id="blocks.vimeoVideo.autoplay" defaultMessage="Autoplay" />}
                                    type="checkbox"
                                    component={FinalFormSwitch}
                                />
                            </BlocksFinalForm>
                        );
                    },
                }),
            },
        },
    },
    (block) => {
        return {
            ...block,
            previewContent: (state) => {
                return state.vimeoIdentifier ? [{ type: "text", content: state.vimeoIdentifier }] : [];
            },
        };
    },
);

import { Field, FinalFormInput, FinalFormSelect } from "@comet/admin";
import {
    BlockInterface,
    BlocksFinalForm,
    BlockState,
    Collapsible,
    CollapsibleSwitchButtonHeader,
    composeBlocks,
    createBlockSkeleton,
    createOptionalBlock,
    decomposeUpdateStateAction,
    withAdditionalBlockAttributes,
} from "@comet/blocks-admin";
import { Box, Divider, MenuItem, Paper, Typography } from "@mui/material";
import * as React from "react";
import { Field as ReactFinalFormField } from "react-final-form";
import { FormattedMessage, useIntl } from "react-intl";

import { SeoBlockData, SeoBlockInput } from "../blocks.generated";
import { PixelImageBlock } from "./PixelImageBlock";
import useSitemapChangeFrequencyFormOptions from "./seo/useSitemapChangeFrequencyFormOptions";
import useSitemapPagePriorityFormOptions from "./seo/useSitemapPagePriorityFormOptions";

interface CreateSeoBlockOptions {
    image?: BlockInterface;
}

export function createSeoBlock({ image = PixelImageBlock }: CreateSeoBlockOptions = {}): BlockInterface {
    const OptionalImageBlock = createOptionalBlock(image, {
        title: <FormattedMessage id="comet.sitemap.openGraphImage" defaultMessage="Open Graph Image" />,
    });

    const composed = composeBlocks({ openGraphImage: OptionalImageBlock });

    const { api: composedApi, block: composedBlock } = composed;

    const block = withAdditionalBlockAttributes<Omit<SeoBlockData, "openGraphImage">>({
        noIndex: false,
        priority: "0_5",
        changeFrequency: "weekly",
        htmlTitle: undefined,
        metaDescription: undefined,
        openGraphTitle: undefined,
        openGraphDescription: undefined,
    })(composedBlock);

    type State = BlockState<typeof block>;

    const SeoBlock: BlockInterface<SeoBlockData, State, SeoBlockInput> = {
        ...createBlockSkeleton(),
        ...block,
        name: "Seo",

        displayName: <FormattedMessage id="comet.blocks.seo" defaultMessage="SEO" />,

        AdminComponent: ({ state, updateState }) => {
            const intl = useIntl();
            const { openGraphImage } = composedApi.adminComponents({
                state,
                updateState: decomposeUpdateStateAction(updateState, ["openGraphImage"]),
            });

            const priorityOptions = useSitemapPagePriorityFormOptions();
            const changeFrequencyOptions = useSitemapChangeFrequencyFormOptions();

            return (
                <div>
                    <BlocksFinalForm
                        onSubmit={(values) => {
                            updateState((prevState) => ({
                                ...prevState,
                                htmlTitle: values.htmlTitle,
                                metaDescription: values.metaDescription,

                                openGraphTitle: values.openGraphTitle,
                                openGraphDescription: values.openGraphDescription,
                                noIndex: values.noIndex,
                                priority: values.priority,
                                changeFrequency: values.changeFrequency,
                            }));
                        }}
                        initialValues={{
                            htmlTitle: state.htmlTitle,
                            metaDescription: state.metaDescription,

                            openGraphTitle: state.openGraphTitle,
                            openGraphDescription: state.openGraphDescription,

                            noIndex: state.noIndex,
                            priority: state.priority,
                            changeFrequency: state.changeFrequency,
                        }}
                    >
                        {/* Meta */}
                        <Box marginTop={4} marginBottom={8}>
                            <Typography variant="h4" gutterBottom>
                                <FormattedMessage id="comet.blocks.seo.meta.sectionTitle" defaultMessage="Meta Tags" />
                            </Typography>

                            <Field
                                label={intl.formatMessage({
                                    id: "comet.blocks.seo.html  Title",
                                    defaultMessage: "HTML Title",
                                })}
                                name="htmlTitle"
                                component={FinalFormInput}
                                fullWidth
                            />

                            <Field
                                label={intl.formatMessage({
                                    id: "comet.blocks.seo.metaDescription",
                                    defaultMessage: "Meta Description",
                                })}
                                name="metaDescription"
                                multiline
                                rows={3}
                                rowsMax={5}
                                component={FinalFormInput}
                                fullWidth
                            />
                        </Box>

                        {/* Open Graph */}
                        <Box marginTop={8} marginBottom={8}>
                            <Typography variant="h4" gutterBottom>
                                <FormattedMessage id="comet.blocks.seo.openGraph.sectionTitle" defaultMessage="Open Graph" />
                            </Typography>
                            <Field
                                label={intl.formatMessage({
                                    id: "comet.blocks.seo.openGraphTitle",
                                    defaultMessage: "Title",
                                })}
                                name="openGraphTitle"
                                component={FinalFormInput}
                                fullWidth
                            />
                            <Field
                                label={intl.formatMessage({
                                    id: "comet.blocks.seo.openGraphDescription",
                                    defaultMessage: "Description",
                                })}
                                name="openGraphDescription"
                                multiline={true}
                                rows={3}
                                rowsMax={5}
                                component={FinalFormInput}
                                fullWidth
                            />
                            {openGraphImage}
                        </Box>

                        {/* Sitemap */}
                        <Box marginTop={8} marginBottom={8}>
                            <Typography variant="h4" gutterBottom>
                                <FormattedMessage id="comet.blocks.seo.sitemap.sectionTitle" defaultMessage="Sitemap" />
                            </Typography>

                            <ReactFinalFormField
                                name="noIndex"
                                type="checkbox"
                                parse={(v) => {
                                    return !v; // parse from noIndex to index
                                }}
                                format={(v) => {
                                    return !v; // format back from index to noIndex
                                }}
                            >
                                {({ input: { checked, onChange } }) => {
                                    const open = checked ? checked : false;
                                    return (
                                        <Paper variant="outlined">
                                            <Collapsible
                                                open={open}
                                                header={
                                                    <CollapsibleSwitchButtonHeader
                                                        checked={open}
                                                        title={<FormattedMessage id="comet.seo.sitemap.pageIndex" defaultMessage="Page Index" />}
                                                    />
                                                }
                                                onChange={onChange}
                                            >
                                                <Divider />
                                                <Box padding={4}>
                                                    <Field
                                                        label={intl.formatMessage({
                                                            id: "comet.blocks.seo.sitemap.priority",
                                                            defaultMessage: "Priority",
                                                        })}
                                                        name="priority"
                                                        fullWidth
                                                    >
                                                        {(props) => (
                                                            <FinalFormSelect {...props} fullWidth>
                                                                {priorityOptions.map((option) => (
                                                                    <MenuItem value={option.value} key={option.value}>
                                                                        {option.label}
                                                                    </MenuItem>
                                                                ))}
                                                            </FinalFormSelect>
                                                        )}
                                                    </Field>
                                                    <Field
                                                        label={intl.formatMessage({
                                                            id: "comet.blocks.seo.sitemap.changeFrequency",
                                                            defaultMessage: "Change Frequency",
                                                        })}
                                                        name="changeFrequency"
                                                        fullWidth
                                                    >
                                                        {(props) => (
                                                            <FinalFormSelect {...props} fullWidth>
                                                                {changeFrequencyOptions.map((option) => (
                                                                    <MenuItem value={option.value} key={option.value}>
                                                                        {option.label}
                                                                    </MenuItem>
                                                                ))}
                                                            </FinalFormSelect>
                                                        )}
                                                    </Field>
                                                </Box>
                                            </Collapsible>
                                        </Paper>
                                    );
                                }}
                            </ReactFinalFormField>
                        </Box>
                    </BlocksFinalForm>
                </div>
            );
        },
    };

    return SeoBlock;
}

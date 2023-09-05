import { Field, FinalFormInput, FinalFormSelect, messages } from "@comet/admin";
import { Add, Delete } from "@comet/admin-icons";
import {
    AdminComponentButton,
    AdminComponentPaper,
    AdminComponentSectionGroup,
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
import { Box, Divider, Grid, IconButton, MenuItem, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import arrayMutators from "final-form-arrays";
import * as React from "react";
import { Field as ReactFinalFormField } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { FormattedMessage, useIntl } from "react-intl";

import { SeoBlockData, SeoBlockInput } from "../blocks.generated";
import { validateUrl } from "../validation/validateUrl";
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
        alternativeLinks: [],
        htmlTitle: undefined,
        metaDescription: undefined,
        openGraphTitle: undefined,
        openGraphDescription: undefined,
        structuredData: undefined,
        canonicalUrl: undefined,
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

                                structuredData: values.structuredData,

                                noIndex: values.noIndex,
                                priority: values.priority,
                                changeFrequency: values.changeFrequency,

                                canonicalUrl: values.canonicalUrl,

                                alternativeLinks: values.alternativeLinks,
                            }));
                        }}
                        mutators={{ ...arrayMutators }}
                        initialValues={{
                            htmlTitle: state.htmlTitle,
                            metaDescription: state.metaDescription,

                            openGraphTitle: state.openGraphTitle,
                            openGraphDescription: state.openGraphDescription,

                            structuredData: state.structuredData,

                            noIndex: state.noIndex,
                            priority: state.priority,
                            changeFrequency: state.changeFrequency,

                            canonicalUrl: state.canonicalUrl,

                            alternativeLinks: state.alternativeLinks,
                        }}
                    >
                        {/* Meta */}
                        <Box marginBottom={8}>
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

                        {/* Structured Data */}
                        <Box marginTop={8} marginBottom={8}>
                            <Typography variant="h4" gutterBottom>
                                <FormattedMessage id="comet.blocks.seo.structuredData.sectionTitle" defaultMessage="Structured Data" />
                            </Typography>
                            <Field name="structuredData" multiline={true} rows={15} component={FinalFormInput} fullWidth />
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

                        {/* Canonical Tag */}
                        <Box marginTop={8} marginBottom={8}>
                            <Typography variant="h4" gutterBottom>
                                <FormattedMessage id="comet.blocks.seo.canonicalTag.sectionTitle" defaultMessage="Canonical Tag" />
                            </Typography>
                            <Field label={<FormattedMessage {...messages.url} />} name="canonicalUrl" component={FinalFormInput} fullWidth />
                        </Box>

                        {/* Alternate Hreflang */}
                        <Box marginTop={8} marginBottom={8}>
                            <AdminComponentSectionGroup
                                title={<FormattedMessage id="comet.blocks.seo.alternativeLinks.sectionTitle" defaultMessage="Alternate links" />}
                            >
                                <AdminComponentPaper>
                                    <FieldArray name="alternativeLinks">
                                        {({ fields }) => (
                                            <>
                                                {fields.map((link, i) => (
                                                    <Grid key={i} container spacing={2} sx={{ marginBottom: 2 }}>
                                                        <Grid item xs={3}>
                                                            <Field
                                                                label={
                                                                    <FormattedMessage
                                                                        id="comet.blocks.seo.alternativeLinks.code"
                                                                        defaultMessage="Code"
                                                                    />
                                                                }
                                                                name={`${link}.code`}
                                                                component={FinalFormInput}
                                                                placeholder="en-US"
                                                            />
                                                        </Grid>
                                                        <Grid item xs>
                                                            <Field
                                                                label={<FormattedMessage {...messages.url} />}
                                                                name={`${link}.url`}
                                                                component={FinalFormInput}
                                                                fullWidth
                                                                validate={(url) => validateUrl(url)}
                                                            />
                                                        </Grid>
                                                        <Grid item alignSelf="flex-start">
                                                            <DeleteButtonWrapper>
                                                                <IconButton onClick={() => fields.remove(i)} size="large">
                                                                    <Delete />
                                                                </IconButton>
                                                            </DeleteButtonWrapper>
                                                        </Grid>
                                                    </Grid>
                                                ))}
                                                <AdminComponentButton variant="primary" onClick={() => fields.push({ code: "", url: "" })}>
                                                    <AddButtonContent>
                                                        <AddButtonIcon />
                                                        <Typography>
                                                            <FormattedMessage {...messages.add} />
                                                        </Typography>
                                                    </AddButtonContent>
                                                </AdminComponentButton>
                                            </>
                                        )}
                                    </FieldArray>
                                </AdminComponentPaper>
                            </AdminComponentSectionGroup>
                        </Box>
                    </BlocksFinalForm>
                </div>
            );
        },
    };

    return SeoBlock;
}

const AddButtonContent = styled("span")`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 4px 0;
`;

const AddButtonIcon = styled(Add)`
    font-size: 24px;
    margin-bottom: 8px;
`;

const DeleteButtonWrapper = styled("div")`
    padding-top: 24px;
`;

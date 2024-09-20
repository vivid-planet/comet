import {
    CheckboxListField,
    Field,
    FinalForm,
    MainContent,
    RadioGroupField,
    SelectField,
    Stack,
    SwitchField,
    TextAreaField,
    TextField,
} from "@comet/admin";
import {
    Add,
    FocusPointCenter,
    FocusPointEast,
    FocusPointNorth,
    FocusPointNortheast,
    FocusPointNorthwest,
    FocusPointSouth,
    FocusPointSoutheast,
    FocusPointSouthwest,
    FocusPointWest,
    Snips,
} from "@comet/admin-icons";
import {
    AdminComponentButton,
    AdminComponentNestedButton,
    AdminComponentPaper,
    AdminComponentSection,
    AdminComponentSectionGroup,
    BlocksFinalForm,
    ColumnsLayoutPreview,
    ColumnsLayoutPreviewContent,
    ColumnsLayoutPreviewSpacing,
    createBlocksBlock,
    createColumnsBlock,
    createFinalFormBlock,
    createListBlock,
    createOptionalBlock,
    resolveNewState,
} from "@comet/blocks-admin";
import { DamImageBlock, FinalFormToggleButtonGroup, PixelImageBlock } from "@comet/cms-admin";
import { Box, Grid, MenuItem, Typography } from "@mui/material";
import { ReactNode, useState } from "react";

import { RichTextBlock } from "./blocks/RichTextBlock";

const FinalFormRichTextBlock = createFinalFormBlock(RichTextBlock);

const OptionalRichTextBlock = createOptionalBlock(RichTextBlock, { title: "Optional block" });

const ListBlock = createListBlock({ name: "ListBlock", block: DamImageBlock });

const BlocksBlock = createBlocksBlock({ name: "BlocksBlock", supportedBlocks: { image: DamImageBlock, richText: RichTextBlock } });

const ColumnsBlock = createColumnsBlock({
    name: "ColumnsBlock",
    contentBlock: BlocksBlock,
    displayName: "Columns",
    layouts: [
        {
            columns: 2,
            label: "Default",
            name: "default",
            preview: (
                <ColumnsLayoutPreview>
                    <ColumnsLayoutPreviewContent width={6} />
                    <ColumnsLayoutPreviewSpacing width={2} />
                    <ColumnsLayoutPreviewContent width={6} />
                </ColumnsLayoutPreview>
            ),
        },
    ],
});

interface CustomSelectItemProps {
    icon: ReactNode;
    primary: ReactNode;
    secondary: ReactNode;
}

function CustomSelectItem({ icon, primary, secondary }: CustomSelectItemProps) {
    return (
        <Grid container spacing={4} alignItems="center">
            <Grid item>
                <Box display="flex" alignItems="center" paddingLeft={2} color="text.secondary">
                    {icon}
                </Box>
            </Grid>
            <Grid item>
                <Typography variant="body2">{primary}</Typography>
                <Typography variant="body2" color="textSecondary">
                    {secondary}
                </Typography>
            </Grid>
        </Grid>
    );
}

export function ComponentDemo() {
    const [optionalBlockState, setOptionalBlockState] = useState(OptionalRichTextBlock.defaultValues());
    const [pixelImageBlockState, setPixelImageBlockState] = useState(PixelImageBlock.defaultValues());
    const [listBlockState, setListBlockState] = useState(ListBlock.defaultValues());
    const [blocksBlockState, setBlocksBlockState] = useState(BlocksBlock.defaultValues());
    const [columnsBlockState, setColumnsBlockState] = useState(ColumnsBlock.defaultValues());
    const [imageBlockState, setImageBlockState] = useState(DamImageBlock.defaultValues());

    return (
        <Stack topLevelTitle="Component demo">
            <MainContent>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h2" gutterBottom>
                            Basic Blocks
                        </Typography>

                        <AdminComponentSectionGroup title="Grouped Section Headline">
                            <AdminComponentSection>
                                <Typography variant="subtitle1">Label</Typography>
                            </AdminComponentSection>

                            <AdminComponentSection>
                                <Typography variant="caption">
                                    Infotext/Caption Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
                                    Aenean massa.
                                </Typography>
                            </AdminComponentSection>

                            <AdminComponentSection>
                                <AdminComponentPaper>Card with any content</AdminComponentPaper>
                            </AdminComponentSection>
                        </AdminComponentSectionGroup>

                        <FinalForm
                            mode="add"
                            onSubmit={() => {
                                // Noop
                            }}
                            initialValues={{ richText: RichTextBlock.defaultValues() }}
                        >
                            <TextField name="text" placeholder="Input" fullWidth />

                            <SelectField name="select" fullWidth>
                                <MenuItem value="Option 1">Option 1</MenuItem>
                                <MenuItem value="Option 2">Option 2</MenuItem>
                                <MenuItem value="Option 3">Option 3</MenuItem>
                            </SelectField>

                            <TextField name="text" label="Input with label" fullWidth />

                            <TextField name="textDisabled" label="Input disabled" placeholder="Input" fullWidth disabled />

                            <SelectField name="select" label="Select with label" fullWidth>
                                <MenuItem value="Option 1">Option 1</MenuItem>
                                <MenuItem value="Option 2">Option 2</MenuItem>
                                <MenuItem value="Option 3">Option 3</MenuItem>
                            </SelectField>

                            <SelectField name="selectDisabled" label="SelectField disabled" fullWidth disabled>
                                <MenuItem value="Option 1">Option 1</MenuItem>
                                <MenuItem value="Option 2">Option 2</MenuItem>
                                <MenuItem value="Option 3">Option 3</MenuItem>
                            </SelectField>

                            <SelectField name="select" label="Select">
                                <MenuItem value="Option 1">Option 1</MenuItem>
                                <MenuItem value="Option 2">Option 2</MenuItem>
                                <MenuItem value="Option 3">Option 3</MenuItem>
                            </SelectField>

                            <SelectField name="select" label="inline">
                                <MenuItem value="Option 1">Option 1</MenuItem>
                                <MenuItem value="Option 2">Option 2</MenuItem>
                                <MenuItem value="Option 3">Option 3</MenuItem>
                            </SelectField>

                            <SelectField
                                name="select"
                                label={
                                    <>
                                        items{" "}
                                        <Typography color="error" component="span">
                                            Fix <code>min-width</code> problem
                                        </Typography>
                                    </>
                                }
                            >
                                <MenuItem value="Option 1">1</MenuItem>
                                <MenuItem value="Option 2">2</MenuItem>
                                <MenuItem value="Option 3">3</MenuItem>
                            </SelectField>

                            <SelectField name="select-custom" label="Custom select" fullWidth>
                                <MenuItem value="Option 1">
                                    <CustomSelectItem icon={<Snips />} primary="Option 1" secondary="Secondary text" />
                                </MenuItem>
                                <MenuItem value="Option 2">
                                    <CustomSelectItem icon={<Snips />} primary="Option 2" secondary="Secondary text" />
                                </MenuItem>
                                <MenuItem value="Option 3">
                                    <CustomSelectItem icon={<Snips />} primary="Option 3" secondary="Secondary text" />
                                </MenuItem>
                            </SelectField>

                            <TextAreaField name="textArea" label="Text Area" fullWidth />

                            <Field name="richText" label="Rich Text" component={FinalFormRichTextBlock} fullWidth />

                            <RadioGroupField
                                label="Single choice"
                                layout="column"
                                name="single-choice"
                                fullWidth
                                options={[
                                    {
                                        label: "Option 1",
                                        value: "Option 1",
                                    },
                                    {
                                        label: "Option 2",
                                        value: "Option 2",
                                    },
                                    {
                                        label: "Option 3",
                                        value: "Option 3",
                                    },
                                    {
                                        label: "Option 4 disabled",
                                        value: "Option 4",
                                        disabled: true,
                                    },
                                ]}
                            />

                            <CheckboxListField
                                layout="column"
                                label="Multiple choice"
                                variant="horizontal"
                                name="multiple-choice"
                                fullWidth
                                options={[
                                    {
                                        label: "Option 1",
                                        value: "Option 1",
                                    },
                                    {
                                        label: "Option 2",
                                        value: "Option 2",
                                    },
                                    {
                                        label: "Option 3",
                                        value: "Option 3",
                                    },
                                    {
                                        label: "Option 4 disabled",
                                        value: "Option 4",
                                        disabled: true,
                                    },
                                ]}
                            />

                            <SwitchField name="switch" fieldLabel="Switch with label" />

                            <SwitchField name="switch" label="Switch with inline label" />

                            <SwitchField name="switch" fieldLabel="Switch disabled" disabled />

                            <Field
                                name="button-group-row"
                                label="Button group"
                                component={FinalFormToggleButtonGroup}
                                options={[
                                    { value: "SOUTHWEST", icon: <FocusPointSouthwest /> },
                                    { value: "NORTHWEST", icon: <FocusPointNorthwest /> },
                                    { value: "CENTER", icon: <FocusPointCenter /> },
                                    { value: "NORTHEAST", icon: <FocusPointNortheast /> },
                                    { value: "SOUTHEAST", icon: <FocusPointSoutheast /> },
                                ]}
                                fullWidth
                            />

                            <Field
                                name="alignment"
                                label="Button group multirow"
                                component={FinalFormToggleButtonGroup}
                                options={[
                                    { value: "topLeft", icon: <FocusPointNorthwest /> },
                                    { value: "topMiddle", icon: <FocusPointNorth /> },
                                    { value: "topRight", icon: <FocusPointNortheast /> },
                                    { value: "middleLeft", icon: <FocusPointWest /> },
                                    { value: "center", icon: <FocusPointCenter /> },
                                    { value: "middleRight", icon: <FocusPointEast /> },
                                    { value: "bottomLeft", icon: <FocusPointSouthwest /> },
                                    { value: "bottomMiddle", icon: <FocusPointSouth /> },
                                    { value: "bottomRight", icon: <FocusPointSoutheast /> },
                                ]}
                                optionsPerRow={3}
                                fullWidth
                            />
                        </FinalForm>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h2" gutterBottom>
                            Action Blocks
                        </Typography>

                        <AdminComponentSection>
                            <OptionalRichTextBlock.AdminComponent
                                state={optionalBlockState}
                                updateState={(setStateAction) => setOptionalBlockState((prevState) => resolveNewState({ prevState, setStateAction }))}
                            />
                        </AdminComponentSection>

                        <AdminComponentSection>
                            <AdminComponentNestedButton displayName="Nested" preview="Lorem impsum dolor" />
                        </AdminComponentSection>

                        <AdminComponentSection>
                            <AdminComponentButton startIcon={<Add />} variant="primary">
                                Action Primary
                            </AdminComponentButton>
                        </AdminComponentSection>

                        <AdminComponentSection>
                            <AdminComponentButton startIcon={<Add />}>Action Default</AdminComponentButton>
                        </AdminComponentSection>

                        <AdminComponentSection>
                            <PixelImageBlock.AdminComponent
                                state={pixelImageBlockState}
                                updateState={(setStateAction) =>
                                    setPixelImageBlockState((prevState) => resolveNewState({ prevState, setStateAction }))
                                }
                            />
                        </AdminComponentSection>

                        <Typography variant="h2" gutterBottom>
                            Collection Blocks
                        </Typography>

                        <AdminComponentSection title="List Block">
                            <ListBlock.AdminComponent
                                state={listBlockState}
                                updateState={(setStateAction) => setListBlockState((prevState) => resolveNewState({ prevState, setStateAction }))}
                            />
                        </AdminComponentSection>
                        <AdminComponentSection title="Blocks Block">
                            <BlocksBlock.AdminComponent
                                state={blocksBlockState}
                                updateState={(setStateAction) => setBlocksBlockState((prevState) => resolveNewState({ prevState, setStateAction }))}
                            />
                        </AdminComponentSection>
                        <AdminComponentSection title="Columns Block">
                            <ColumnsBlock.AdminComponent
                                state={columnsBlockState}
                                updateState={(setStateAction) => setColumnsBlockState((prevState) => resolveNewState({ prevState, setStateAction }))}
                            />
                        </AdminComponentSection>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="h2" gutterBottom>
                            Compounds
                        </Typography>

                        <AdminComponentSection>
                            <AdminComponentPaper disablePadding>
                                <DamImageBlock.AdminComponent
                                    state={imageBlockState}
                                    updateState={(setStateAction) =>
                                        setImageBlockState((prevState) => resolveNewState({ prevState, setStateAction }))
                                    }
                                />
                            </AdminComponentPaper>
                            <AdminComponentPaper>
                                <BlocksFinalForm
                                    onSubmit={() => {
                                        // noop
                                    }}
                                >
                                    <SelectField name="aspectRatio" label="Aspect ratio">
                                        <MenuItem value="2:3">2:3</MenuItem>
                                        <MenuItem value="4:3">4:3</MenuItem>
                                        <MenuItem value="16:9">16:9</MenuItem>
                                    </SelectField>
                                    <SelectField name="overlay" label="Overlay">
                                        <MenuItem value="0%">0%</MenuItem>
                                        <MenuItem value="10%">10%</MenuItem>
                                        <MenuItem value="20%">20%</MenuItem>
                                    </SelectField>

                                    <SwitchField name="shadow" fieldLabel="Shadow" />
                                </BlocksFinalForm>
                            </AdminComponentPaper>
                        </AdminComponentSection>
                    </Grid>
                </Grid>
            </MainContent>
        </Stack>
    );
}

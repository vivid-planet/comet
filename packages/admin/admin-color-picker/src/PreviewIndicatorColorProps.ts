// For reasons I cannot explain, this type must be in it's own file, otherwise the import of `ColorPickerColorPreviewProps` in the story is missing this part.
// Story: packages/admin/admin-stories/src/docs/components/ColorPicker/stories/ColorPickerCustomized.stories.tsx

export type PreviewIndicatorColorProps = {
    type: "color";
    color: string;
};

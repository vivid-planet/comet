export const commonFieldComponentArgTypes = {
    name: {
        control: "text",
    },
    label: {
        control: "text",
    },
    // TODO: Should we also include error and warning? (doesn't seem to work out of the box)
    helperText: {
        control: "text",
    },
    placeholder: {
        control: "text",
    },
    required: {
        control: "boolean",
    },
    disabled: {
        control: "boolean",
    },
    variant: {
        control: "select",
        options: ["vertical", "horizontal"],
    },
    fullWidth: {
        control: "boolean",
    },
} as const;

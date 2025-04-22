import { ReadOnlyField } from "@comet/admin";
import { FormattedMessage } from "react-intl";

export default {
    title: "@comet/admin/ReadOnlyField",
};

export const BlockReadOnlyField = () => {
    return (
        <div style={{ width: 300 }}>
            <ReadOnlyField label={<FormattedMessage id="readOnlyField.label" defaultMessage="Block Content" />} value="Hello World" type="block" />
        </div>
    );
};

export const BooleanReadOnlyField = () => {
    return (
        <div style={{ width: 300 }}>
            <ReadOnlyField label={<FormattedMessage id="readOnlyField.label" defaultMessage="Enabled" />} value={true} />
        </div>
    );
};

export const DateReadOnlyField = () => {
    return (
        <div style={{ width: 300 }}>
            <ReadOnlyField
                label={<FormattedMessage id="readOnlyField.label" defaultMessage="Start Date" />}
                value={new Date("2023-10-01T00:00:00Z")}
            />
        </div>
    );
};

export const FileReadOnlyField = () => {
    const file = new File(["Hello World"], "example.txt", {
        type: "text/plain",
    });

    return (
        <div style={{ width: 300 }}>
            <ReadOnlyField label={<FormattedMessage id="readOnlyField.label" defaultMessage="Files to Download" />} value={file} />
        </div>
    );
};

export const FilesReadOnlyField = () => {
    const file1 = new File(["Hello grumpy"], "grumpy cat.txt", {
        type: "text/plain",
    });

    const file2 = new File(["Hello sleepy"], "sleepy cat.txt", {
        type: "text/plain",
    });

    const file3 = new File(["Hello angry"], "angry cat.txt", {
        type: "text/plain",
    });

    return (
        <div style={{ width: 300 }}>
            <ReadOnlyField label={<FormattedMessage id="readOnlyField.label" defaultMessage="Files to Download" />} value={[file1, file2, file3]} />
        </div>
    );
};

export const SelectReadOnlyField = () => {
    const selectedOption = { label: "Option 1", value: "option1" };

    return (
        <div style={{ width: 300 }}>
            <ReadOnlyField label={<FormattedMessage id="readOnlyField.label" defaultMessage="Selected Option" />} value={selectedOption} />
        </div>
    );
};

export const MultiSelectReadOnlyField = () => {
    const selectedOptions = [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Option 3", value: "option3" },
        { label: "Option 4", value: "option4" },
        { label: "Option 5", value: "option5" },
        { label: "Option 6", value: "option6" },
    ];

    return (
        <div style={{ width: 300 }}>
            <ReadOnlyField label={<FormattedMessage id="readOnlyField.label" defaultMessage="Selected Options" />} value={selectedOptions} />
        </div>
    );
};

export const NumberReadOnlyField = () => {
    return (
        <div style={{ width: 300 }}>
            <ReadOnlyField label={<FormattedMessage id="readOnlyField.label" defaultMessage="Lines of code" />} value={1234567890} />
        </div>
    );
};

export const RichTextReadOnlyField = () => {
    return (
        <div style={{ width: 300 }}>
            <ReadOnlyField
                label={<FormattedMessage id="readOnlyField.label" defaultMessage="Rich Text Content" />}
                value="<h1>Header</h1><p>Paragraph</p><ul><li>List Item 1</li><li>List Item 2</li></ul>"
                type="richtext"
            />
        </div>
    );
};

export const TextReadOnlyField = () => {
    const longText = `Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.`;

    return (
        <div style={{ width: 300 }}>
            <ReadOnlyField label={<FormattedMessage id="readOnlyField.label" defaultMessage="Simple Text Field" />} value={longText} />
        </div>
    );
};

export const TextAreaReadOnlyField = () => {
    const longText = `Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.`;
    return (
        <div style={{ width: 300 }}>
            <ReadOnlyField
                label={<FormattedMessage id="readOnlyField.label" defaultMessage="Multi-line Text Area" />}
                value={longText}
                type="textarea"
            />
        </div>
    );
};

export const NullValueReadOnlyField = () => {
    return (
        <div style={{ width: 300 }}>
            <ReadOnlyField label={<FormattedMessage id="readOnlyField.label" defaultMessage="Null" />} value={null} />
        </div>
    );
};

export const UndefinedValueReadOnlyField = () => {
    return (
        <div style={{ width: 300 }}>
            <ReadOnlyField label={<FormattedMessage id="readOnlyField.label" defaultMessage="Undefined" />} value={undefined} />
        </div>
    );
};

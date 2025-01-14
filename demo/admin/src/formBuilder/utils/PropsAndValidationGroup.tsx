import { OnChangeField, SwitchField, TextField } from "@comet/admin";
import { BlocksFinalForm, createCompositeSetting } from "@comet/blocks-admin";
import { useContentScope, useLocale } from "@comet/cms-admin";
import { FieldSection } from "@src/formBuilder/utils/DisplaySection";
import { useFieldNames } from "@src/formBuilder/utils/FieldNamesContext";
import { EditorState } from "draft-js";
import { ChangeEvent, useEffect, useState } from "react";
import { useField } from "react-final-form";
import { FormattedMessage } from "react-intl";
import slugify from "slugify";

// Copied from packages/admin/cms-admin/src/pages/createEditPageNode.tsx
const transformToSlug = (name: string, locale: string) => {
    let slug = slugify(name, { replacement: "-", lower: true, locale });
    // Remove everything except unreserved characters and percent encoding (https://tools.ietf.org/html/rfc3986#section-2.1)
    // This is necessary because slugify does not remove all reserved characters per default (e.g. "@")
    slug = slug.replace(/[^a-zA-Z0-9-._~]/g, "");
    return slug;
};

export const PropsAndValidationGroup = () => {
    return (
        <FieldSection title={<FormattedMessage id="formBuilder.fieldSection.propsAndValidation" defaultMessage="Props and Validation" />}>
            <FieldNameField nameOfSlugSource="label" name="fieldName" />
            <SwitchField name="mandatory" label={<FormattedMessage id="blocks.commonFormField.mandatory" defaultMessage="Mandatory" />} fullWidth />
        </FieldSection>
    );
};

type FieldNameFieldProps = {
    nameOfSlugSource: string;
    name: string;
};

// TODO: Handle slugify on blur
export const FieldNameField = ({ nameOfSlugSource, name }: FieldNameFieldProps) => {
    const { duplicateFieldNames } = useFieldNames();
    const fieldNameField = useField(name);
    const scope = useContentScope();
    const locale = useLocale({ scope });

    const [fieldNameWasEmptyOnInititalRender, setFieldNameWasEmptyOnInititalRender] = useState(false);
    const [fieldNameWasEditedManually, setFieldNameWasEditedManually] = useState(false);

    useEffect(() => {
        setFieldNameWasEmptyOnInititalRender(!fieldNameField.input.value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <OnChangeField name={nameOfSlugSource}>
                {(
                    slugSourceValue:
                        | string
                        | {
                              editorState: EditorState;
                          },
                ) => {
                    if (!fieldNameWasEditedManually && fieldNameWasEmptyOnInititalRender) {
                        const stringToSlugify =
                            typeof slugSourceValue === "string" ? slugSourceValue : slugSourceValue.editorState.getCurrentContent().getPlainText();
                        const slug = transformToSlug(stringToSlugify, locale);
                        fieldNameField.input.onChange(slug);
                    }
                }}
            </OnChangeField>
            <TextField
                name={name}
                label={<FormattedMessage id="blocks.commonFormField.fieldName" defaultMessage="Field Name" />}
                fullWidth
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setFieldNameWasEditedManually(true);
                    fieldNameField.input.onChange(event.target.value);
                }}
                // TODO: Change this to `validateWarning` once fixed: https://vivid-planet.atlassian.net/browse/COM-1542
                validate={(fieldName) => {
                    if (duplicateFieldNames.includes(fieldName)) {
                        return (
                            <FormattedMessage id="blocks.commonFormField.fieldNameAlreadyExists" defaultMessage="This field name already exists" />
                        );
                    }
                }}
            />
        </>
    );
};

/**
 * @deprecated Use <PropsAndValidationGroup /> instead
 */
export const propsAndValidationGroup = {
    title: <FormattedMessage id="blocks.commonFormField.propsAndValidation" defaultMessage="Props and Validation" />,
    paper: true,
    blocks: {
        fieldName: {
            block: createCompositeSetting<string>({
                defaultValue: "",
                AdminComponent: ({ state, updateState }) => {
                    return (
                        <BlocksFinalForm<{ value: typeof state }>
                            onSubmit={({ value }) => updateState(value ? value.toLowerCase().replace(/[^a-z0-9]/g, "-") : "")}
                            initialValues={{ value: state || undefined }}
                        >
                            <TextField
                                name="value"
                                label={<FormattedMessage id="blocks.commonFormField.fieldName" defaultMessage="Field Name" />}
                                fullWidth
                            />
                        </BlocksFinalForm>
                    );
                },
            }),
            hiddenInSubroute: true,
        },
        mandatory: {
            // TODO: Use helper function once merged: https://github.com/vivid-planet/comet/pull/3052
            block: createCompositeSetting<boolean>({
                defaultValue: false,
                AdminComponent: ({ state, updateState }) => (
                    <BlocksFinalForm<{ value: typeof state }> onSubmit={({ value }) => updateState(value)} initialValues={{ value: state }}>
                        <SwitchField
                            name="value"
                            label={<FormattedMessage id="blocks.commonFormField.mandatory" defaultMessage="Mandatory" />}
                            fullWidth
                        />
                    </BlocksFinalForm>
                ),
            }),
            hiddenInSubroute: true,
        },
    },
};

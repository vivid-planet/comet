import { OnChangeField, SwitchField, TextField } from "@comet/admin";
import { useContentScope, useLocale } from "@comet/cms-admin";
import { useFieldNames } from "@src/formBuilder/utils/FieldNamesContext";
import { EditorState } from "draft-js";
import { ChangeEvent, FocusEvent, useEffect, useState } from "react";
import { useField } from "react-final-form";
import { FormattedMessage } from "react-intl";
import slugify from "slugify";

import { PropsAndValidationFieldGroup } from "./FieldSection";

// Copied from packages/admin/cms-admin/src/pages/createEditPageNode.tsx
const transformToSlug = (name: string, locale: string) => {
    let slug = slugify(name, { replacement: "-", lower: true, locale });
    // Remove everything except unreserved characters and percent encoding (https://tools.ietf.org/html/rfc3986#section-2.1)
    // This is necessary because slugify does not remove all reserved characters per default (e.g. "@")
    slug = slug.replace(/[^a-zA-Z0-9-._~]/g, "");
    return slug;
};

export const PropsAndValidationGroupFields = () => {
    return (
        <PropsAndValidationFieldGroup>
            <FieldNameField nameOfSlugSource="label" name="fieldName" />
            <SwitchField name="mandatory" label={<FormattedMessage id="formBuilder.common.mandatory" defaultMessage="Mandatory" />} fullWidth />
        </PropsAndValidationFieldGroup>
    );
};

type FieldNameFieldProps = {
    nameOfSlugSource: string;
    name: string;
};

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
                label={<FormattedMessage id="formBuilder.common.fieldName" defaultMessage="Field Name" />}
                fullWidth
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setFieldNameWasEditedManually(true);
                    fieldNameField.input.onChange(event.target.value);
                }}
                onBlur={(event: FocusEvent<HTMLInputElement>) => {
                    const slug = transformToSlug(event.target.value, locale);
                    fieldNameField.input.onChange(slug);
                }}
                // TODO: Change this to `validateWarning` once fixed: https://vivid-planet.atlassian.net/browse/COM-1542
                validate={(fieldName) => {
                    if (duplicateFieldNames.includes(fieldName)) {
                        return <FormattedMessage id="formBuilder.common.fieldNameAlreadyExists" defaultMessage="This field name already exists" />;
                    }
                }}
            />
        </>
    );
};

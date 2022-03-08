import { Field, FinalFormInput } from "@comet/admin";
import React from "react";
import { useIntl } from "react-intl";

export interface FolderFormValues {
    name: string;
}

export const FolderFormFields = (): React.ReactElement => {
    const intl = useIntl();

    return (
        <Field label={intl.formatMessage({ id: "comet.pages.dam.name", defaultMessage: "Name" })} name="name" component={FinalFormInput} required />
    );
};

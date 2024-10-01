import { Field, FinalFormInput } from "@comet/admin";
import { useIntl } from "react-intl";

export interface FolderFormValues {
    name: string;
}

export const FolderFormFields = () => {
    const intl = useIntl();

    return (
        <Field
            label={intl.formatMessage({ id: "comet.pages.dam.name", defaultMessage: "Name" })}
            name="name"
            component={FinalFormInput}
            fullWidth
            autoFocus
            required
        />
    );
};

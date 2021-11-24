import { Field, FinalFormSingleSelect } from "@comet/admin";
import { Check } from "@comet/admin-icons";
import { ListItemText, MenuItem } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";
import { FormattedMessage } from "react-intl";

enum SortDirection {
    ASC = "ASC",
    DESC = "DESC",
}
interface SortInformation {
    columnName: string;
    direction: SortDirection;
}
type Sorting = {
    id: string;
    sortInfo: SortInformation;
    label: React.ReactNode;
};

const sortings: Sorting[] = [
    {
        id: "nameASC",
        sortInfo: {
            columnName: "name",
            direction: SortDirection.ASC,
        },
        label: <FormattedMessage id="comet.pages.dam.filename" defaultMessage="Filename" />,
    },
    {
        id: "updatedAtDESC",
        sortInfo: {
            columnName: "updatedAt",
            direction: SortDirection.DESC,
        },
        label: <FormattedMessage id="comet.pages.dam.changeDate" defaultMessage="Change Date" />,
    },
    {
        id: "createdAtDESC",
        sortInfo: {
            columnName: "createdAt",
            direction: SortDirection.DESC,
        },
        label: <FormattedMessage id="comet.pages.dam.creationDate" defaultMessage="Creation Date" />,
    },
];

interface FormValues {
    sorting: string;
}

function Story() {
    return (
        <Form<FormValues>
            initialValues={{ sorting: sortings[0].id }}
            onSubmit={() => {}}
            render={({ handleSubmit }) => {
                return (
                    <form onSubmit={handleSubmit}>
                        <Field name="sorting" fullWidth>
                            {(props) => (
                                <FinalFormSingleSelect {...props}>
                                    {sortings.map((sorting) => (
                                        <MenuItem value={sorting.id} key={sorting.id}>
                                            {(selected: boolean) => (
                                                <>
                                                    <ListItemText>{sorting.label}</ListItemText>
                                                    {selected && <Check />}
                                                </>
                                            )}
                                        </MenuItem>
                                    ))}
                                </FinalFormSingleSelect>
                            )}
                        </Field>
                    </form>
                );
            }}
        />
    );
}

storiesOf("@comet/admin/table/form", module).add("Final Form Single Select", () => {
    return <Story />;
});

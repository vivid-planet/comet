import { Field, FilterBarSingleSelect } from "@comet/admin";
import { Check } from "@comet/admin-icons";
import { List, ListItem, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { PropsWithChildren } from "react";
import { Form } from "react-final-form";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";

enum SortDirection {
    ASC = "ASC",
    DESC = "DESC",
}
interface SortInformation {
    columnName: string;
    direction: SortDirection;
}
type Sorting = {
    sortInfo: SortInformation;
    label: React.ReactNode;
};

const sortings: Sorting[] = [
    {
        sortInfo: {
            columnName: "name",
            direction: SortDirection.ASC,
        },
        label: <FormattedMessage id="comet.pages.dam.filename" defaultMessage="Filename" />,
    },
    {
        sortInfo: {
            columnName: "updatedAt",
            direction: SortDirection.DESC,
        },
        label: <FormattedMessage id="comet.pages.dam.changeDate" defaultMessage="Change Date" />,
    },
    {
        sortInfo: {
            columnName: "createdAt",
            direction: SortDirection.DESC,
        },
        label: <FormattedMessage id="comet.pages.dam.creationDate" defaultMessage="Creation Date" />,
    },
];

interface SortListItemProps {
    selected?: boolean;
    onClick: () => void;
}

const InnerListItem = styled.div`
    min-width: 150px;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const SortListItem = ({ children, selected, onClick }: PropsWithChildren<SortListItemProps>): React.ReactElement => {
    return (
        <ListItem button selected={selected} onClick={onClick}>
            <InnerListItem>
                <div>{children}</div>
                {selected && <Check />}
            </InnerListItem>
        </ListItem>
    );
};

interface FormValues {
    sorting: Sorting;
}

function Story() {
    return (
        <Form<FormValues> initialValues={{ sorting: sortings[0] }} onSubmit={() => {}}>
            {({ values }) => {
                return (
                    <FilterBarSingleSelect label={<>Sorted by {values.sorting.label}</>}>
                        {({ onClose }) => {
                            return (
                                <Field<FormValues["sorting"]> name="sorting">
                                    {({ input: { value, onChange } }) => (
                                        <List>
                                            {sortings.map((sorting, index) => {
                                                return (
                                                    <SortListItem
                                                        key={index}
                                                        onClick={() => {
                                                            onChange(sorting);
                                                            onClose();
                                                        }}
                                                        selected={value.sortInfo.columnName === sorting.sortInfo.columnName}
                                                    >
                                                        <Typography variant="body1">{sorting.label}</Typography>
                                                    </SortListItem>
                                                );
                                            })}
                                        </List>
                                    )}
                                </Field>
                            );
                        }}
                    </FilterBarSingleSelect>
                );
            }}
        </Form>
    );
}

storiesOf("@comet/admin/table/filterbar", module).add("Filter Bar Single Select", () => {
    return <Story />;
});

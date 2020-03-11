import { Field, FilterBar, FinalFormInput, IField, Table, TableFilterFinalForm, TableQuery, useTableQuery, useTableQueryFilter } from "@comet/admin";
import { FinalFormReactSelectStaticOptions } from "@comet/admin-react-select";
import { storiesOf } from "@storybook/react";
import gql from "graphql-tag";
import * as qs from "qs";
import * as React from "react";
import { FormSpy } from "react-final-form";
import styled from "styled-components";

import { apolloStoryDecorator } from "../../apollo-story.decorator";

const gqlRest = gql;

const query = gqlRest`
query users(
    $pathFunction: any
    $query: String
    $name: String
    $username: String
) {
    users(
        query: $name
    ) @rest(type: "User", pathBuilder: $pathFunction) {
        id
        name
        username
        email
    }
}
`;
function pathFunction({ args }: { args: { [key: string]: any } }) {
    interface IPathMapping {
        [arg: string]: string;
    }
    const paramMapping: IPathMapping = {
        query: "q",
    };

    const q = Object.keys(args).reduce((acc: { [key: string]: any }, key: string): { [key: string]: any } => {
        if (paramMapping[key] && args[key]) {
            acc[paramMapping[key]] = args[key];
        }
        return acc;
    }, {});
    return `users?${qs.stringify(q, { arrayFormat: "brackets" })}`;
}

interface IQueryData {
    users: Array<{
        id: number;
        name: string;
        username: string;
        email: string;
    }>;
}

interface IFilterValues {
    name: string;
    // username: string;
    nameBlub: string;
}

interface IVariables extends IFilterValues {
    pathFunction: any;
}

export const FieldContainerComponent = styled.div``;

// const RangeSliderField: React.FC = () => {
//     return (
//         <Field
//             name="username"
//             component={RangeSlider}
//             rangeValues={{ min: 1, max: 100 }}
//             fullWidth
//             fieldContainerComponent={FieldContainerComponent}
//         />
//     );
// };

const Name: React.FC = () => {
    return <Field name="name" type="text" component={FinalFormInput} fullWidth fieldContainerComponent={FieldContainerComponent} />;
};

const NameBlub: React.FC = () => {
    const options = [
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry", isDisabled: true },
        { value: "vanilla", label: "Vanilla" },
    ];
    return (
        <Field
            name="nameBlub"
            type="text"
            component={FinalFormReactSelectStaticOptions}
            fullWidth
            fieldContainerComponent={FieldContainerComponent}
            options={options}
        />
    );
};

const fields: IField[] = [
    // {
    //     type: "range",
    //     name: "username",
    //     label: "Username",
    //     component: RangeSliderField,
    //     placeHolder: "x - x",
    // },
    {
        type: "text",
        name: "name",
        label: "name",
        component: Name,
        placeHolder: "Suche...",
    },
    { type: "text", name: "nameBlub", label: "nameBlub", component: NameBlub, placeHolder: "Bitte wählen" },
];

function Story() {
    const filterApi = useTableQueryFilter<Partial<IFilterValues>>({});
    const { tableData, api, loading, error } = useTableQuery<IQueryData, Partial<IVariables>>()(query, {
        variables: {
            ...filterApi.current,
            pathFunction,
        },
        resolveTableData: (data) => ({
            data: data.users,
            totalCount: data.users.length,
        }),
    });

    return (
        <TableQuery api={api} loading={loading} error={error}>
            {tableData && (
                <>
                    <TableFilterFinalForm filterApi={filterApi}>
                        <FormSpy subscription={{ values: true }}>
                            {(props) => {
                                return <FilterBar fieldBarWidth={200} fieldSidebarHeight={550} fields={fields} />;
                            }}
                        </FormSpy>
                    </TableFilterFinalForm>
                    <Table
                        {...tableData}
                        columns={[
                            {
                                name: "name",
                                header: "Name",
                            },
                            {
                                name: "username",
                                header: "Username",
                            },
                            {
                                name: "email",
                                header: "E-Mail",
                            },
                        ]}
                    />
                </>
            )}
        </TableQuery>
    );
}

storiesOf("react-admin-core", module)
    .addDecorator(apolloStoryDecorator())
    .add("Table with Filterbar", () => <Story />);

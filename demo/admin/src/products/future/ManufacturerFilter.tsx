import { gql, useQuery } from "@apollo/client";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { GridFilterInputValueProps, GridFilterOperator } from "@mui/x-data-grid-pro";
import { GQLManufacturersFilterQuery, GQLManufacturersFilterQueryVariables } from "@src/products/ManufacturerFilter.generated";
import * as React from "react";
import { useIntl } from "react-intl";

const manufacturerFilterFragment = gql`
    fragment ManufacturersFilter on Manufacturer {
        id
        name
    }
`;

const manufacturersQuery = gql`
    query ManufacturersFilter($offset: Int!, $limit: Int!, $search: String) {
        manufacturers(offset: $offset, limit: $limit, search: $search) {
            nodes {
                ...ManufacturersFilter
            }
            totalCount
        }
    }
    ${manufacturerFilterFragment}
`;

// Source: https://mui.com/x/react-data-grid/filtering/customization/#multiple-values-operator
function ManufacturerFilter(props: GridFilterInputValueProps) {
    const { item, applyValue } = props;
    const intl = useIntl();

    const { data } = useQuery<GQLManufacturersFilterQuery, GQLManufacturersFilterQueryVariables>(manufacturersQuery, {
        variables: {
            offset: 0,
            limit: 10,
        },
    });

    // source https://mui.com/material-ui/react-autocomplete/
    return (
        <Autocomplete
            id="manufacturer-select"
            size="small"
            options={data?.manufacturers.nodes ?? []}
            autoHighlight
            value={item.value}
            isOptionEqualToValue={(option, value) => {
                // does only highlight the selected value in options-list but does not trigger getOptionLabel-Call
                return option.id == value;
            }}
            getOptionLabel={(option) => {
                // option.name is not set if loaded from filters-model, small delay replacing id with name because of loading
                return option.name ?? data?.manufacturers.nodes.find((item) => item.id === option)?.name ?? option;
            }}
            onChange={(event, value, reason) => {
                // value can't be "{ id: value.id, name: value.name }" because value is sent to api
                applyValue({ id: item.id, operatorValue: "equals", value: value ? value.id : undefined, columnField: "manufacturer" }); // columnField needs to match field-prop and filter-name
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={intl.formatMessage({ id: "manufacturer-filter.placeholder", defaultMessage: "Choose a manufacturer" })}
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password", // disable autocomplete and autofill
                    }}
                />
            )}
        />
    );
}

export const ManufacturerFilterOperators: GridFilterOperator[] = [
    {
        value: "equals",
        getApplyFilterFn: (filterItem) => {
            throw new Error("not implemented, we filter server side");
        },
        InputComponent: ManufacturerFilter,
        InputComponentProps: { column: "string" },
    },
];

import { GridFilterButton, Toolbar, ToolbarActions, ToolbarFillSpace, ToolbarItem } from "@comet/admin";
import { MoreVertical } from "@comet/admin-icons";
import { Button } from "@mui/material";
import { GridSearchIcon } from "@mui/x-data-grid";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { useCurrentDamFolder } from "../../CurrentDamFolderProvider";
import { UploadFilesButton } from "../fileUpload/UploadFilesButton";
import { FolderHead } from "../FolderHead";
import { DamMoreActions } from "../selection/DamMoreActions";

type DamGridToolbarProps = {
    allowedMimeTypes: any;
    additionalToolbarItems: any;
    breadcrumbs: any;
    isSearching: any;
    numberItems: number;
};

export const DamGridToolbar = ({
    allowedMimeTypes,
    numberItems,
    isSearching,
    breadcrumbs,
    additionalToolbarItems,
}: DamGridToolbarProps): React.ReactElement => {
    const { folderId } = useCurrentDamFolder();
    const uploadFilters = {
        allowedMimetypes: allowedMimeTypes,
    };
    return (
        <Toolbar>
            <ToolbarItem>
                <FolderHead isSearching={isSearching} numberItems={numberItems} breadcrumbs={breadcrumbs} folderId={folderId} />
            </ToolbarItem>
            <ToolbarItem>
                <GridSearchIcon />
            </ToolbarItem>
            <ToolbarItem>
                <GridFilterButton />
            </ToolbarItem>
            <ToolbarFillSpace />
            <ToolbarActions>
                {additionalToolbarItems}
                <DamMoreActions
                    button={
                        <Button variant="text" color="inherit" endIcon={<MoreVertical />} sx={{ mx: 2 }}>
                            <FormattedMessage id="comet.pages.dam.moreActions" defaultMessage="More actions" />
                        </Button>
                    }
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                    folderId={folderId}
                    filter={uploadFilters}
                />

                <UploadFilesButton folderId={folderId} filter={uploadFilters} />
            </ToolbarActions>
        </Toolbar>
    );
};

// type Filter = {
//     value: string | undefined;
//     column: string | undefined;
//     operator: string | undefined;
//     logicalOperator: string | undefined;
// };
// const filterBoilerplate: Filter = { value: undefined, column: undefined, operator: undefined, logicalOperator: undefined };

// const DamFilterActions = () => {
//     const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//     const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//         setAnchorEl(event.currentTarget);
//     };

//     const [filter, setFilter] = React.useState<Array<Filter>>([filterBoilerplate]);

//     const handleClose = () => {
//         setAnchorEl(null);
//     };

//     const addFilter = () => {
//         setFilter((filter) => [...filter, { ...filterBoilerplate, logicalOperator: "Add" }]);
//     };

//     const checkFilterCompleteness = (filter: Filter) => {
//         return filter.column && filter.logicalOperator && filter.operator && filter.value;
//     };

//     const amountOfActiveFilters = filter.filter(checkFilterCompleteness).length;

//     const resetFilter = () => {
//         setFilter([filterBoilerplate]);
//     };
//     const removeFilterAt = (index: number) => {
//         const updatedFilters = filter.filter((_, i) => index != i);

//         setFilter(updatedFilters);
//     };
//     return (
//         <>
//             <Button variant="outlined" color="inherit" startIcon={<Filter />} sx={{ mx: 2 }} onClick={handleClick}>
//                 <FormattedMessage id="comet.pages.dam.filter" defaultMessage="Filter" />
//                 {amountOfActiveFilters > 0 && <SelectedFiltersChip>{amountOfActiveFilters}</SelectedFiltersChip>}
//             </Button>
//             <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={handleClose}
//                 keepMounted={false}
//                 // transformOrigin={transformOrigin}
//                 // anchorOrigin={anchorOrigin}
//             >
//                 <AdminComponentSection disableBottomMargin>
//                     <AdminComponentPaper>
//                         <BlocksFinalForm
//                             onSubmit={() => {
//                                 // noop
//                             }}
//                         >
//                             <FilterRow filter={filter} removeFilterAt={removeFilterAt} />
//                         </BlocksFinalForm>
//                     </AdminComponentPaper>
//                     <BottomSection>
//                         <Button color="inherit" onClick={addFilter} startIcon={<Add />}>
//                             <FormattedMessage id="comet.pages.dam.filter.add" defaultMessage="Add filter" />
//                         </Button>
//                         <Button color="inherit" onClick={resetFilter} startIcon={<Reset />}>
//                             <FormattedMessage id="comet.pages.dam.filter.reset" defaultMessage="Reset filters" />
//                         </Button>
//                     </BottomSection>
//                 </AdminComponentSection>
//             </Menu>
//         </>
//     );
// };

// const FilterRow = ({ filter, removeFilterAt }: { filter: Array<Filter>; removeFilterAt: (index: number) => void }) => {
//     const intl = useIntl();
//     return (
//         <>
//             {filter.map((_, index) => (
//                 <FilterRowWrapper key={index}>
//                     <DeleteButton onClick={() => removeFilterAt(index)} variant="text" color="inherit" startIcon={<Delete />} />
//                     {index >= 1 && (
//                         <FilterConnection>
//                             <SelectField value="And" displayEmpty fullWidth name={`logicalOperaton${index}`}>
//                                 <MenuItem value="And">
//                                     <FormattedMessage id="comet.pages.dam.filter.and" defaultMessage="And" />
//                                 </MenuItem>
//                                 <MenuItem value="Or">
//                                     <FormattedMessage id="comet.pages.dam.filter.or" defaultMessage="Or" />
//                                 </MenuItem>
//                             </SelectField>
//                         </FilterConnection>
//                     )}
//                     <FilterColumn>
//                         <SelectField
//                             name={`column${index}`}
//                             fullWidth
//                             label={<FormattedMessage id="comet.pages.dam.filter.column" defaultMessage="Column" />}
//                         >
//                             <MenuItem value="Option 1">
//                                 <FormattedMessage id="comet.pages.dam.filter.column.name" defaultMessage="Name1" />
//                             </MenuItem>
//                         </SelectField>
//                     </FilterColumn>
//                     <FilterOperator>
//                         <SelectField
//                             name={`operator${index}`}
//                             fullWidth
//                             label={<FormattedMessage id="comet.pages.dam.filter.operator" defaultMessage="Operator" />}
//                         >
//                             <MenuItem value="contains">
//                                 <FormattedMessage id="comet.pages.dam.filter.conatins" defaultMessage="Contains" />
//                             </MenuItem>
//                             <MenuItem value="startsWith">
//                                 <FormattedMessage id="comet.pages.dam.filter.startsWith" defaultMessage="Starts with" />
//                             </MenuItem>
//                         </SelectField>
//                     </FilterOperator>
//                     <FilterValue>
//                         <TextField
//                             name={`value${index}`}
//                             fullWidth
//                             placeholder={intl.formatMessage({ id: "comet.filter.value.placeholder", defaultMessage: "Filter value" })}
//                             label={<FormattedMessage id="comet.pages.dam.filter.value" defaultMessage="Value" />}
//                         />
//                     </FilterValue>
//                 </FilterRowWrapper>
//             ))}
//         </>
//     );
// };

// const BottomSection = styled("div")`
//     display: flex;
//     justify-content: space-between;
//     padding-bottom: 10px;
//     padding-top: 10px;
// `;

// const SelectedFiltersChip = styled("div")`
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     height: 24px;
//     width: 24px;
//     background-color: ${({ theme }) => theme.palette.grey[100]};
//     margin-left: 10px;
//     border-radius: 12px;
//     font-size: 12px;
//     font-weight: 400;
//     color: ${({ theme }) => theme.palette.text.primary};
// `;
// const FilterConnection = styled("div")`
//     margin: 0;
//     width: 100%;
//     grid-column: 2;
// `;

// const FilterColumn = styled("div")`
//     margin: 0;
//     width: 100%;
//     grid-column: 3;
// `;
// const FilterOperator = styled("div")`
//     margin: 0;
//     width: 100%;
//     grid-column: 4;
// `;

// const FilterValue = styled("div")`
//     margin: 0;
//     width: 100%;
//     grid-column: 5;
// `;

// const FilterRowWrapper = styled("div")`
//     display: grid;
//     align-items: end;
//     grid-template-columns: auto 1fr 2fr 1fr 2fr;
//     grid-column-gap: 10px;
//     grid-row-gap: 10px;
//     margin-bottom: 20px;
// `;

// const DeleteButton = styled(Button)`
//     grid-column: 1;
// `;

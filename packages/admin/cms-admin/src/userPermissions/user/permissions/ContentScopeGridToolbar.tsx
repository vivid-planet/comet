import { Select } from "@comet/admin-icons";
import { Button, styled } from "@mui/material";
import { GridToolbarContainer, GridToolbarFilterButton, GridToolbarQuickFilter } from "@mui/x-data-grid";
import React from "react";
import { FormattedMessage } from "react-intl";

type Props = {
    actions?: { openDialog: () => void };
};

export const ContentScopeGridToolbar = ({ actions }: Props) => {
    return (
        <GridToolbar>
            <GridToolbarAction>
                <CustomToolbarAction>
                    <GridToolbarQuickFilter />
                    <FilterButton onResize={undefined} onResizeCapture={undefined} />
                </CustomToolbarAction>
                {actions ? (
                    <CustomToolbarAction>
                        <Button variant="contained" color="primary" startIcon={<Select />} onClick={actions.openDialog}>
                            <FormattedMessage id="comet.contentScope.select" defaultMessage="Select Scopes" />
                        </Button>
                    </CustomToolbarAction>
                ) : null}
            </GridToolbarAction>
        </GridToolbar>
    );
};

const GridToolbar = styled(GridToolbarContainer)`
    padding: 10px;
    border-bottom: 1px solid ${({ theme }) => theme.palette.grey[100]};
`;

const FilterButton = styled(GridToolbarFilterButton)`
    border: 1px solid ${({ theme }) => theme.palette.grey[100]};
    border-radius: 5px;
    height: 40px;
    color: ${({ theme }) => theme.palette.text.primary};
`;

const GridToolbarAction = styled("div")`
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
`;

const CustomToolbarAction = styled("div")`
    display: flex;
    align-items: center;
    gap: 20px;
`;

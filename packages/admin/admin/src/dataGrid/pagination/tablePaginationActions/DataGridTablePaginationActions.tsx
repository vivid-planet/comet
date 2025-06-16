import { ChevronLeft, ChevronRight } from "@comet/admin-icons";
import { type ComponentsOverrides, IconButton, type Theme, type Typography, useMediaQuery, useTheme, useThemeProps } from "@mui/material";
import { type TablePaginationActionsProps } from "@mui/material/TablePagination/TablePaginationActions";
import { gridPageCountSelector, gridPaginationSelector, useGridApiContext, useGridSelector } from "@mui/x-data-grid-pro";
import { type ThemedComponentBaseProps } from "helpers/ThemedComponentBaseProps";
import { type FunctionComponent, type PropsWithChildren, type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { PageOfTypography, PreviousNextContainer, Root } from "./DataGridTablePaginationActions.styles";

export type DataGridTablePaginationActionsClassKey = "root" | "pageOfTypography" | "previousNextContainer";

type TablePaginationActions = "previous" | "next";

export type DataGridTablePaginationActionsProps = ThemedComponentBaseProps<{
    root: "div";
    pageOfTypography: typeof Typography;
    previousNextContainer: "div";
}> &
    TablePaginationActionsProps & {
        iconMapping?: Partial<Record<TablePaginationActions, ReactNode>>;
    };

const defaultIconMapping: Record<TablePaginationActions, ReactNode> = {
    previous: <ChevronLeft />,
    next: <ChevronRight />,
};

export const DataGridTablePaginationActions: FunctionComponent<PropsWithChildren<DataGridTablePaginationActionsProps>> = (inProps) => {
    const apiRef = useGridApiContext();
    const paginationState = useGridSelector(apiRef, gridPaginationSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    const theme = useTheme();
    const showPageOfStyled = useMediaQuery(theme.breakpoints.up(425));

    const {
        count,
        onPageChange,
        page,
        rowsPerPage,
        iconMapping: passedIconMapping = {},
        sx,
        className,
        slotProps = {},
    } = useThemeProps({
        props: inProps,
        name: "CometAdminDataGridTablePaginationActions",
    });
    const iconMapping = { ...defaultIconMapping, ...passedIconMapping };

    return (
        <Root sx={sx} className={className} {...slotProps.root}>
            {showPageOfStyled && (
                <PageOfTypography variant="body2" {...slotProps.pageOfTypography}>
                    <FormattedMessage
                        defaultMessage="Page {page} of {pageCount}"
                        id="comet.dataGridTablePaginationActions.pageXOfY"
                        values={{
                            page: page + 1,
                            pageCount: pageCount,
                        }}
                    />
                </PageOfTypography>
            )}

            <PreviousNextContainer {...slotProps.previousNextContainer}>
                <IconButton
                    disabled={paginationState.paginationModel.page === 0}
                    onClick={(event) => {
                        onPageChange(event, page - 1);
                    }}
                >
                    {iconMapping["previous"]}
                </IconButton>

                <IconButton
                    disabled={count !== -1 ? paginationState.paginationModel.page >= Math.ceil(count / rowsPerPage) - 1 : false}
                    onClick={(event) => {
                        onPageChange(event, page + 1);
                    }}
                >
                    {iconMapping["next"]}
                </IconButton>
            </PreviousNextContainer>
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminDataGridTablePaginationActions: DataGridTablePaginationActionsProps;
    }

    interface ComponentNameToClassKey {
        CometAdminDataGridTablePaginationActions: DataGridTablePaginationActionsClassKey;
    }

    interface Components {
        CometAdminDataGridTablePaginationActions?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminDataGridTablePaginationActions"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminDataGridTablePaginationActions"];
        };
    }
}

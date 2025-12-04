import { ChevronLeft, ChevronRight } from "@comet/admin-icons";
import {
    type ComponentsOverrides,
    IconButton,
    type TablePaginationActionsProps,
    type Theme,
    type Typography,
    useMediaQuery,
    useTheme,
    useThemeProps,
} from "@mui/material";
import { gridPageCountSelector, gridPaginationSelector, useGridApiContext, useGridSelector } from "@mui/x-data-grid-pro";
import { type ThemedComponentBaseProps } from "helpers/ThemedComponentBaseProps";
import { type FunctionComponent, type PropsWithChildren, type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { PageOf, PreviousNext, Root } from "./DataGridPaginationActions.styles";

export type DataGridPaginationActionsClassKey = "root" | "pageOf" | "previousNext";

type PaginationActions = "previous" | "next";

export type DataGridPaginationActionsProps = ThemedComponentBaseProps<{
    root: "div";
    pageOf: typeof Typography;
    previousNext: "div";
}> &
    TablePaginationActionsProps & {
        iconMapping?: Partial<Record<PaginationActions, ReactNode>>;
    };

const defaultIconMapping: Record<PaginationActions, ReactNode> = {
    previous: <ChevronLeft />,
    next: <ChevronRight />,
};

export const DataGridPaginationActions: FunctionComponent<PropsWithChildren<DataGridPaginationActionsProps>> = (inProps) => {
    const apiRef = useGridApiContext();
    const paginationState = useGridSelector(apiRef, gridPaginationSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    const theme = useTheme();
    const showPageOfStyled = useMediaQuery(theme.breakpoints.up("sm"));

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
        name: "CometAdminDataGridPaginationActions",
    });
    const iconMapping = { ...defaultIconMapping, ...passedIconMapping };

    const isOnFirstPage = paginationState.paginationModel.page === 0;
    const isOnLastPage = count !== -1 ? paginationState.paginationModel.page >= Math.ceil(count / rowsPerPage) - 1 : false;
    return (
        <Root sx={sx} className={className} {...slotProps.root}>
            {showPageOfStyled && (
                <PageOf variant="body2" {...slotProps.pageOf}>
                    <FormattedMessage
                        defaultMessage="Page {page} of {pageCount}"
                        id="comet.dataGridPaginationActions.pageXOfY"
                        values={{
                            page: page + 1,
                            pageCount: pageCount,
                        }}
                    />
                </PageOf>
            )}

            <PreviousNext {...slotProps.previousNext}>
                <IconButton
                    disabled={isOnFirstPage}
                    onClick={(event) => {
                        onPageChange(event, page - 1);
                    }}
                >
                    {iconMapping["previous"]}
                </IconButton>

                <IconButton
                    disabled={isOnLastPage}
                    onClick={(event) => {
                        onPageChange(event, page + 1);
                    }}
                >
                    {iconMapping["next"]}
                </IconButton>
            </PreviousNext>
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminDataGridPaginationActions: DataGridPaginationActionsProps;
    }

    interface ComponentNameToClassKey {
        CometAdminDataGridPaginationActions: DataGridPaginationActionsClassKey;
    }

    interface Components {
        CometAdminDataGridPaginationActions?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminDataGridPaginationActions"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminDataGridPaginationActions"];
        };
    }
}

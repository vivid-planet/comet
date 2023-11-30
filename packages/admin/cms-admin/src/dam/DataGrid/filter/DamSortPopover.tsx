import { ISortInformation, SortDirection } from "@comet/admin";
import { ChevronDown } from "@comet/admin-icons";
import { Check } from "@mui/icons-material";
import { List, ListItem, Typography } from "@mui/material";
import React, { PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";

import * as sc from "./DamSortPopover.sc";

type Sorting = {
    sortInfo: ISortInformation;
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

const SortListItem = ({ children, selected, onClick }: PropsWithChildren<SortListItemProps>): React.ReactElement => {
    return (
        <ListItem button selected={selected} onClick={onClick}>
            <sc.InnerListItem>
                <div>{children}</div>
                {selected && <Check />}
            </sc.InnerListItem>
        </ListItem>
    );
};

interface DamSortPopoverProps {
    onChoose: (sort: ISortInformation) => void;
    currentSort: ISortInformation;
}

// This component is heavily based on comet-admin FilterBarPopoverFilter (https://github.com/vivid-planet/comet-admin/blob/next/packages/admin/src/table/filterbar/filterBarPopoverFilter/FilterBarPopoverFilter.tsx)
// Todo: Create a generic FilterBarPopover component in comet-admin and use it instead of this component

export const DamSortPopover = ({ onChoose, currentSort }: DamSortPopoverProps): React.ReactElement => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);

    const close = () => {
        setAnchorEl(null);
    };

    const handleClick = (sortInfo: ISortInformation) => {
        onChoose(sortInfo);
        close();
    };

    return (
        <sc.Wrapper $active={anchorEl !== null}>
            <sc.SortByButton
                onClick={(event) => {
                    setAnchorEl(event.currentTarget);
                }}
                disableRipple
                color="info"
            >
                <sc.LabelWrapper>
                    <Typography variant="body1">
                        <FormattedMessage
                            id="comet.pages.dam.sorting"
                            defaultMessage="Sorting: {sorting}"
                            values={{
                                sorting: sortings.find((sorting) => sorting.sortInfo.columnName === currentSort.columnName)?.label,
                            }}
                        />
                    </Typography>
                </sc.LabelWrapper>
                <ChevronDown />
            </sc.SortByButton>
            <sc.StyledPopover
                open={open}
                anchorEl={anchorEl}
                onClose={close}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                PaperProps={{ square: true, elevation: 1 }}
                elevation={2}
                keepMounted
            >
                <List>
                    {sortings.map((sorting, index) => {
                        return (
                            <SortListItem
                                key={index}
                                onClick={() => handleClick(sorting.sortInfo)}
                                selected={currentSort.columnName === sorting.sortInfo.columnName}
                            >
                                <Typography variant="body1">{sorting.label}</Typography>
                            </SortListItem>
                        );
                    })}
                </List>
            </sc.StyledPopover>
        </sc.Wrapper>
    );
};

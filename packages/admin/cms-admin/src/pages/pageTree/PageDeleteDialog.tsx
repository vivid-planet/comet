import { DeleteButton, messages } from "@comet/admin";
import { ArrowRight, Delete } from "@comet/admin-icons";
import { AdminComponentPaper } from "@comet/blocks-admin";
import { Cancel } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { GQLPageTreePageFragment } from "../../graphql.generated";
import { DeleteContentInformation, PageCount, PageVisibility, WarningIcon, WarningIconWrapper } from "./PageDeleteDialog.sc";
import { PageVisibilityIcon } from "./PageVisibilityIcon";

export interface PageDeleteDialogProps {
    dialogOpen: boolean;
    handleCancelClick: () => void;
    handleDeleteClick: () => void;
    selectedNodes: GQLPageTreePageFragment[];
}

interface DeleteDialogInformation {
    hasSubpages: boolean;
    publishedCount: number;
    unpublishedCount: number;
    archivedCount: number;
    dependenciesCount: number;
    totalPageCount: number;
}

export const PageDeleteDialog: React.FC<PageDeleteDialogProps> = (props) => {
    const { dialogOpen, handleCancelClick, handleDeleteClick } = props;

    const dialogInformation = React.useMemo<DeleteDialogInformation | undefined>(() => {
        if (props.selectedNodes) {
            const dialogInformation = {
                hasSubpages: props.selectedNodes.find((element) => element.parentId !== props.selectedNodes[0].parentId) !== undefined,
                publishedCount: props.selectedNodes.filter((element) => element.visibility === "Published").length,
                unpublishedCount: props.selectedNodes.filter((element) => element.visibility === "Unpublished").length,
                archivedCount: props.selectedNodes.filter((element) => element.visibility === "Archived").length,
                dependenciesCount: 0, // TODO: implement dependencies
            };

            return {
                ...dialogInformation,
                totalPageCount: dialogInformation.publishedCount + dialogInformation.unpublishedCount + dialogInformation.archivedCount,
            };
        }
    }, [props.selectedNodes]);

    return (
        <Dialog open={dialogOpen} onClose={handleCancelClick}>
            <DialogTitle>
                <FormattedMessage id="comet.pages.pages.page.deleteDialog.title" defaultMessage="Delete page?" />
            </DialogTitle>
            <DialogContent>
                <DeleteContentInformation variant="outlined">
                    <Box padding={4} display="flex" flexDirection="row">
                        <WarningIconWrapper>
                            <WarningIcon color="inherit" fontSize="large" />
                        </WarningIconWrapper>
                        <Typography variant="h6">
                            {dialogInformation?.hasSubpages ? (
                                <FormattedMessage
                                    id="comet.pages.pages.page.deleteDialog.contentIncludingSubpages"
                                    defaultMessage="You are about to delete {amount, plural, =0 {no pages} one {# page} other {# pages}} in total, including subpages."
                                    values={{
                                        amount: dialogInformation?.totalPageCount,
                                    }}
                                />
                            ) : (
                                <FormattedMessage
                                    id="comet.pages.pages.page.deleteDialog.content"
                                    defaultMessage="You are about to delete {amount, plural, =0 {no pages} one {# page} other {# pages}}."
                                    values={{
                                        amount: dialogInformation?.totalPageCount,
                                    }}
                                />
                            )}
                        </Typography>
                    </Box>
                </DeleteContentInformation>

                {dialogInformation && dialogInformation?.publishedCount > 0 && (
                    <AdminComponentPaper>
                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                            <PageVisibility>
                                <PageVisibilityIcon visibility="Published" />
                                <FormattedMessage id="comet.pages.pages.page.visibility.published" defaultMessage="Published" />
                            </PageVisibility>
                            <ArrowRight />
                            <PageCount>
                                <FormattedMessage
                                    id="comet.pages.pages.page.deleteDialog.countPages"
                                    defaultMessage="{amount, plural, =0 {no pages} one {# page} other {# pages}}"
                                    values={{ amount: dialogInformation.publishedCount }}
                                />
                                <Delete />
                            </PageCount>
                        </Box>
                    </AdminComponentPaper>
                )}
                {dialogInformation && dialogInformation?.unpublishedCount > 0 && (
                    <AdminComponentPaper>
                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                            <PageVisibility>
                                <PageVisibilityIcon visibility="Unpublished" />
                                <FormattedMessage id="comet.pages.pages.page.visibility.unpublished" defaultMessage="Unpublished" />
                            </PageVisibility>
                            <ArrowRight />
                            <PageCount>
                                <FormattedMessage
                                    id="comet.pages.pages.page.deleteDialog.countPages"
                                    defaultMessage="{amount, plural, =0 {no pages} one {# page} other {# pages}}"
                                    values={{ amount: dialogInformation.unpublishedCount }}
                                />
                                <Delete />
                            </PageCount>
                        </Box>
                    </AdminComponentPaper>
                )}
                {dialogInformation && dialogInformation?.archivedCount > 0 && (
                    <AdminComponentPaper>
                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                            <PageVisibility>
                                <PageVisibilityIcon visibility="Archived" />
                                <FormattedMessage id="comet.pages.pages.page.visibility.archived" defaultMessage="Archived" />
                            </PageVisibility>
                            <ArrowRight />
                            <PageCount>
                                <FormattedMessage
                                    id="comet.pages.pages.page.deleteDialog.countPages"
                                    defaultMessage="{amount, plural, =0 {no pages} one {# page} other {# pages}}"
                                    values={{ amount: dialogInformation.archivedCount }}
                                />
                                <Delete />
                            </PageCount>
                        </Box>
                    </AdminComponentPaper>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancelClick} color="inherit" startIcon={<Cancel />}>
                    <FormattedMessage {...messages.cancel} />
                </Button>

                <DeleteButton onClick={handleDeleteClick}>
                    <FormattedMessage id="comet.pages.pages.page.deleteDialog.deleteButton" defaultMessage="Delete Page" />
                </DeleteButton>
            </DialogActions>
        </Dialog>
    );
};

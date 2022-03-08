import { IEditDialogApi, StackSwitchApiContext } from "@comet/admin";
import { Edit, Preview } from "@comet/admin-icons";
import { IconButton } from "@material-ui/core";
import React from "react";

import { useContentScope } from "../../contentScope/Provider";
import { openPreviewWindow } from "../../preview/openPreviewWindow";
import PageContextMenu from "./PageContextMenu";
import { PageTreePage } from "./usePageTree";
import { usePageTreeContext } from "./usePageTreeContext";

interface Props {
    page: PageTreePage;
    editDialog: IEditDialogApi;
    children?: React.ReactNode[];
    siteUrl: string;
}

export default function PageActions({ page, editDialog, children, siteUrl }: Props): React.ReactElement {
    const { match: contentScopeMatch } = useContentScope();
    const { documentTypes } = usePageTreeContext();
    const isEditable = !!(page.visibility !== "Archived" && documentTypes[page.documentType].editComponent);

    return (
        <>
            {children && children}
            {page.visibility !== "Archived" && (
                <>
                    <StackSwitchApiContext.Consumer>
                        {(stackApi) => (
                            <IconButton
                                disabled={!isEditable}
                                onClick={() => {
                                    stackApi.activatePage("edit", String(page.id));
                                }}
                                color="primary"
                            >
                                <Edit color={isEditable ? "primary" : "inherit"} />
                            </IconButton>
                        )}
                    </StackSwitchApiContext.Consumer>
                    <IconButton
                        onClick={() => {
                            openPreviewWindow(page.path, contentScopeMatch.url);
                        }}
                    >
                        <Preview />
                    </IconButton>
                </>
            )}
            <PageContextMenu page={page} editDialog={editDialog} siteUrl={siteUrl} />
        </>
    );
}

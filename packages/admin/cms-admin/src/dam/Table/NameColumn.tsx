import { IFilterApi, StackLink } from "@comet/admin";
import { Box, Link } from "@mui/material";
import * as React from "react";
import { FileRejection, useDropzone } from "react-dropzone";

import { TextMatch } from "../../common/MarkedMatches";
import { GQLDamFileTableFragment, GQLDamFolderTableFragment } from "../../graphql.generated";
import { DamFilter } from "../DamTable";
import DamLabel from "./DamLabel";
import { FileUploadApi } from "./fileUpload/useFileUpload";
import { isFile, isFolder } from "./FolderTableRow";
import { DamItemMatches } from "./useDamSearchHighlighting";

interface NameColumnProps {
    item: GQLDamFileTableFragment | GQLDamFolderTableFragment;
    renderDamLabel?: (row: GQLDamFileTableFragment | GQLDamFolderTableFragment, options: { matches?: TextMatch[] }) => React.ReactNode;
    matches: DamItemMatches;
    isSearching: boolean;
    filterApi: IFilterApi<DamFilter>;
    fileUploadApi: FileUploadApi;
}

export const NameColumn: React.VoidFunctionComponent<NameColumnProps> = ({
    item,
    renderDamLabel,
    matches,
    isSearching,
    filterApi,
    fileUploadApi,
}) => {
    const [isFolderHovered, setIsFolderHovered] = React.useState<boolean>(false);

    // handles upload of native file or folder (e.g. file from desktop) to subfolder
    // If the native file is dropped on a folder row in the table, it is uploaded
    // to said folder
    const { getRootProps: getFolderRootProps } = useDropzone({
        ...fileUploadApi.dropzoneConfig,
        noClick: true,
        noDragEventsBubbling: true,
        onDragOver: (event) => {
            console.log("inner onDragOver ", event);
            setIsFolderHovered(true);
            // footerApi.show("upload", dropTargetItem.name);
        },
        onDragLeave: () => {
            setIsFolderHovered(false);
        },
        onDrop: async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            setIsFolderHovered(false);
            // footerApi.hide();
            await fileUploadApi.uploadFiles({ acceptedFiles, fileRejections }, item.id);
        },
    });

    return (
        <Box
            {...(isFolder(item) && getFolderRootProps())}
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
            }}
        >
            {renderDamLabel ? (
                renderDamLabel(item, { matches: matches.get(item.id) })
            ) : (
                <Link
                    underline="none"
                    component={StackLink}
                    pageName={isFile(item) ? "edit" : "folder"}
                    payload={item.id}
                    onClick={() => {
                        if (isFolder(item)) {
                            filterApi.formApi.change("searchText", undefined);
                        }
                    }}
                    sx={{
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <DamLabel asset={item} showPath={isSearching} matches={matches.get(item.id)} />
                </Link>
            )}
        </Box>
    );
};

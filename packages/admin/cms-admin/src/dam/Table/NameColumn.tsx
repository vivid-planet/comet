import { IFilterApi, StackLink } from "@comet/admin";
import { Box, Link } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FileRejection, useDropzone } from "react-dropzone";

import { TextMatch } from "../../common/MarkedMatches";
import { GQLDamFileTableFragment, GQLDamFolderTableFragment } from "../../graphql.generated";
import { DamFilter } from "../DamTable";
import DamLabel from "./DamLabel";
import { FileUploadApi } from "./fileUpload/useFileUpload";
import { FooterType } from "./FolderDataGrid";
import { isFile, isFolder } from "./FolderTableRow";
import { DamItemMatches } from "./useDamSearchHighlighting";

interface DamLabelWrapperProps {
    isHovered?: boolean;
}

const DamLabelWrapper = styled(Box, { shouldForwardProp: (prop) => prop !== "isHovered" })<DamLabelWrapperProps>`
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;

    border: ${({ theme, isHovered }) => (isHovered ? `solid 1px ${theme.palette.primary.main}` : "none")};
    background-color: ${({ isHovered }) => (isHovered ? "rgba(41, 182, 246, 0.1)" : "transparent")};
`;

interface NameColumnProps {
    item: GQLDamFileTableFragment | GQLDamFolderTableFragment;
    renderDamLabel?: (row: GQLDamFileTableFragment | GQLDamFolderTableFragment, options: { matches?: TextMatch[] }) => React.ReactNode;
    matches: DamItemMatches;
    isSearching: boolean;
    filterApi: IFilterApi<DamFilter>;
    fileUploadApi: FileUploadApi;
    footerApi: {
        show: (type: FooterType, { folderName, numSelectedItems }: { folderName?: string; numSelectedItems?: number }) => void;
        hide: () => void;
    };
}

export const NameColumn: React.VoidFunctionComponent<NameColumnProps> = ({
    item,
    renderDamLabel,
    matches,
    isSearching,
    filterApi,
    fileUploadApi,
    footerApi,
}) => {
    const [isFolderHovered, setIsFolderHovered] = React.useState<boolean>(false);

    // handles upload of native file or folder (e.g. file from desktop) to subfolder
    // If the native file is dropped on a folder row in the table, it is uploaded
    // to said folder
    const { getRootProps: getFolderRootProps } = useDropzone({
        ...fileUploadApi.dropzoneConfig,
        noClick: true,
        noDragEventsBubbling: true,
        onDragEnter: () => {
            setIsFolderHovered(true);
        },
        onDragOver: () => {
            footerApi.show("upload", { folderName: item.name });
        },
        onDragLeave: () => {
            setIsFolderHovered(false);
            footerApi.hide();
        },
        onDrop: async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            setIsFolderHovered(false);
            footerApi.hide();

            await fileUploadApi.uploadFiles({ acceptedFiles, fileRejections }, item.id);
        },
    });

    return (
        <DamLabelWrapper isHovered={isFolderHovered} {...(isFolder(item) && getFolderRootProps())}>
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
        </DamLabelWrapper>
    );
};

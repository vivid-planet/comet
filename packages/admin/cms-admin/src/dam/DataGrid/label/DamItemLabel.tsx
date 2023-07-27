import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";

import { MarkedMatches, TextMatch } from "../../../common/MarkedMatches";
import { isFile } from "../../helpers/isFile";
import { GQLDamFileTableFragment, GQLDamFolderTableFragment } from "../FolderDataGrid";
import { ArchivedTag } from "../tags/ArchivedTag";
import { LicenseValidityTags } from "../tags/LicenseValidityTags";
import { DamThumbnail } from "../thumbnail/DamThumbnail";

const LabelWrapper = styled("div")`
    display: flex;
    align-items: center;

    width: 100%;
    height: 100%;
`;

const NameWrapper = styled("div")`
    padding-left: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const Path = styled(Typography)`
    color: ${({ theme }) => theme.palette.grey[300]};
`;

interface DamItemLabelProps {
    asset: GQLDamFolderTableFragment | GQLDamFileTableFragment;
    showPath?: boolean;
    matches?: TextMatch[];
    showLicenseWarnings?: boolean;
    isInboxFromOtherScope?: boolean;
}

const getFilePath = (file: GQLDamFileTableFragment) => {
    const pathArr = [];

    if (file.folder) {
        const parentFolderNames = file.folder.parents.map((parentFolder) => parentFolder.name);

        pathArr.push(...parentFolderNames);
        pathArr.push(file.folder.name);
    }

    return `/${pathArr.join("/")}`;
};

const getFolderPath = (folder: GQLDamFolderTableFragment) => {
    const pathArr = folder.parents.map((parentFolder) => parentFolder.name) ?? [];

    return `/${pathArr.join("/")}`;
};

const DamItemLabel = ({
    asset,
    showPath = false,
    matches,
    showLicenseWarnings = false,
    isInboxFromOtherScope = false,
}: DamItemLabelProps): React.ReactElement => {
    return (
        <LabelWrapper>
            <DamThumbnail asset={asset} />
            <NameWrapper>
                <Typography>{matches ? <MarkedMatches text={asset.name} matches={matches} /> : asset.name}</Typography>
                {showPath && <Path variant="body2">{isFile(asset) ? getFilePath(asset) : getFolderPath(asset)}</Path>}
            </NameWrapper>
            {isFile(asset) && asset.archived && <ArchivedTag />}
            {isFile(asset) && showLicenseWarnings && (
                <LicenseValidityTags
                    expirationDate={asset.license?.expirationDate ? new Date(asset.license.expirationDate) : undefined}
                    isNotValidYet={asset.license?.isNotValidYet}
                    expiresWithinThirtyDays={asset.license?.expiresWithinThirtyDays}
                    hasExpired={asset.license?.hasExpired}
                />
            )}
        </LabelWrapper>
    );
};

export default DamItemLabel;

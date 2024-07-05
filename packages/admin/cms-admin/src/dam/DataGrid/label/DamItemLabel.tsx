import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { IntlShape, useIntl } from "react-intl";

import { MarkedMatches, TextMatch } from "../../../common/MarkedMatches";
import { getFolderName } from "../../helpers/getFolderName";
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
}

const getFilePath = (file: GQLDamFileTableFragment, { intl }: { intl: IntlShape }) => {
    const pathArr = [];

    if (file.folder) {
        const parentFolderNames = file.folder.parents.map((parentFolder) => getFolderName(parentFolder, { intl }));

        pathArr.push(...parentFolderNames);
        pathArr.push(file.folder.name);
    }

    return `/${pathArr.join("/")}`;
};

const getFolderPath = (folder: GQLDamFolderTableFragment, { intl }: { intl: IntlShape }) => {
    const pathArr = folder.parents.map((parentFolder) => getFolderName(parentFolder, { intl })) ?? [];

    return `/${pathArr.join("/")}`;
};

const DamItemLabel = ({ asset, showPath = false, matches, showLicenseWarnings = false }: DamItemLabelProps): React.ReactElement => {
    const intl = useIntl();

    const assetName = isFile(asset) ? asset.name : getFolderName(asset, { intl });

    return (
        <LabelWrapper>
            <DamThumbnail asset={asset} />
            <NameWrapper>
                <Typography>{matches ? <MarkedMatches text={assetName} matches={matches} /> : assetName}</Typography>
                {showPath && <Path variant="body2">{isFile(asset) ? getFilePath(asset, { intl }) : getFolderPath(asset, { intl })}</Path>}
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

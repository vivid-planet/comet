import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { add, compareAsc, getUnixTime } from "date-fns";
import * as React from "react";

import { MarkedMatches, TextMatch } from "../../common/MarkedMatches";
import { GQLDamFileTableFragment, GQLDamFolderTableFragment } from "../../graphql.generated";
import { isFile } from "./FolderTableRow";
import { ArchivedTag } from "./tags/ArchivedTag";
import { LicenseExpiredTag, LicenseExpiresSoonTag, LicenseNotValidYetTag } from "./tags/LicenseWarningTags";
import { DamThumbnail } from "./thumbnail/DamThumbnail";

const LabelWrapper = styled("div")`
    display: flex;
    align-items: center;
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

interface DamLabelProps {
    asset: GQLDamFolderTableFragment | GQLDamFileTableFragment;
    showPath?: boolean;
    matches?: TextMatch[];
    showLicenseWarnings?: boolean;
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

const currentDate = new Date();
const thirtyDaysInSeconds = 60 * 60 * 24 * 30;

const DamLabel = ({ asset, showPath = false, matches, showLicenseWarnings = true }: DamLabelProps): React.ReactElement => {
    const durationTo =
        isFile(asset) && asset.license.durationTo !== null
            ? add(new Date(asset.license.durationTo), {
                  days: 1,
              })
            : null;
    const durationFrom =
        isFile(asset) && asset.license.durationFrom !== null
            ? add(new Date(asset.license.durationFrom), {
                  days: 1,
              })
            : null;

    const differenceBetweenExpirationDateAndNow = durationTo ? getUnixTime(durationTo) - getUnixTime(currentDate) : null;

    return (
        <LabelWrapper>
            <DamThumbnail asset={asset} />
            <NameWrapper>
                <Typography>{matches ? <MarkedMatches text={asset.name} matches={matches} /> : asset.name}</Typography>
                {showPath && <Path variant="body2">{isFile(asset) ? getFilePath(asset) : getFolderPath(asset)}</Path>}
            </NameWrapper>
            {isFile(asset) && asset.archived && <ArchivedTag />}
            {showLicenseWarnings && durationFrom !== null && compareAsc(currentDate, durationFrom) === -1 && <LicenseNotValidYetTag />}
            {showLicenseWarnings && durationTo !== null && compareAsc(currentDate, durationTo) === 1 && <LicenseExpiredTag />}
            {showLicenseWarnings &&
                durationTo !== null &&
                differenceBetweenExpirationDateAndNow !== null &&
                differenceBetweenExpirationDateAndNow > 0 &&
                differenceBetweenExpirationDateAndNow <= thirtyDaysInSeconds && <LicenseExpiresSoonTag expirationDate={durationTo} />}
        </LabelWrapper>
    );
};

export default DamLabel;

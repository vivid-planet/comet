import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";

import { MarkedMatches, TextMatch } from "../../../common/MarkedMatches";
import { GQLDamFileTableFragment, GQLDamFolderTableFragment } from "../../../graphql.generated";
import { getFilePath } from "../../helpers/getFilePath";
import { getFolderPath } from "../../helpers/getFolderPath";
import { isFile } from "../../helpers/isFile";
import { ArchivedTag } from "../tags/ArchivedTag";
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

const TagWrapper = styled("div")`
    margin-left: 10px;
    display: flex;
    justify-content: space-between;
    gap: 5px;
`;

const Path = styled(Typography)`
    text-align: left;
    color: ${({ theme }) => theme.palette.grey[300]};
`;

interface DamItemLabelProps {
    asset: GQLDamFolderTableFragment | GQLDamFileTableFragment;
    showPath?: boolean;
    matches?: TextMatch[];
}

const DamItemLabel = ({ asset, showPath = false, matches }: DamItemLabelProps): React.ReactElement => {
    return (
        <LabelWrapper>
            <DamThumbnail asset={asset} />
            <NameWrapper>
                <Typography>{matches ? <MarkedMatches text={asset.name} matches={matches} /> : asset.name}</Typography>
                {showPath && <Path variant="body2">{isFile(asset) ? getFilePath(asset) : getFolderPath(asset)}</Path>}
            </NameWrapper>
            {isFile(asset) && asset.archived && (
                <TagWrapper>
                    <ArchivedTag />
                </TagWrapper>
            )}
        </LabelWrapper>
    );
};

export default DamItemLabel;

import { Typography } from "@material-ui/core";
import * as React from "react";
import styled from "styled-components";

import { GQLDamFileTableFragment, GQLDamFolderTableFragment } from "../../graphql.generated";
import { isFile } from "./FolderTableRow";
import { DamThumbnail } from "./thumbnail/DamThumbnail";

const LabelWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const NameWrapper = styled.div`
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
}

const getFilePath = (asset: GQLDamFileTableFragment) => {
    const pathArr = [];

    if (asset.folder) {
        const parentFolderNames = asset.folder.parents.map((parentFolder) => parentFolder.name);

        pathArr.push(...parentFolderNames);
        pathArr.push(asset.folder.name);
    }

    return `/${pathArr.join("/")}`;
};

const getFolderPath = (asset: GQLDamFolderTableFragment) => {
    const pathArr = asset.parents.map((parentFolder) => parentFolder.name) ?? [];

    return `/${pathArr.join("/")}`;
};

const DamLabel = ({ asset, showPath = false }: DamLabelProps): React.ReactElement => {
    return (
        <LabelWrapper>
            <DamThumbnail asset={asset} />
            <NameWrapper>
                <Typography>{asset.name}</Typography>
                {showPath && <Path variant="body2">{isFile(asset) ? getFilePath(asset) : getFolderPath(asset)}</Path>}
            </NameWrapper>
        </LabelWrapper>
    );
};

export default DamLabel;

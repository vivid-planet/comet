import { File, Folder, Pdf } from "@comet/admin-icons";
import { styled } from "@mui/material/styles";
import * as React from "react";

import { GQLDamFile, GQLDamFileThumbnailFragment, GQLDamFolder } from "../../../graphql.generated";
import { AudioThumbnail } from "./AudioThumbnail";
import { VideoThumbnail } from "./VideoThumbnail";

const ThumbnailWrapper = styled("div")`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    width: 36px;
    height: 36px;
`;

const ImageThumbnail = styled("img")`
    width: inherit;
    height: inherit;
    border-radius: inherit;
`;

const ColoredFile = styled(File)`
    color: ${({ theme }) => theme.palette.primary.main};
`;

type DamThumbnailFolder = Pick<GQLDamFolder, "__typename">;
type DamThumbnailFile = Pick<GQLDamFile, "__typename" | "mimetype" | "fileUrl"> & { image: GQLDamFileThumbnailFragment | null };

interface DamThumbnailProps {
    asset: DamThumbnailFolder | DamThumbnailFile;
}

export const DamThumbnail = ({ asset }: DamThumbnailProps): React.ReactElement => {
    let thumbnail;
    if (asset.__typename === "DamFile") {
        if (asset.mimetype.startsWith("image/") && asset.image && asset.image.thumbnailUrl) {
            thumbnail = <ImageThumbnail src={asset.image.thumbnailUrl} />;
        } else if (asset.mimetype.startsWith("audio/")) {
            thumbnail = <AudioThumbnail />;
        } else if (asset.mimetype.startsWith("video/")) {
            thumbnail = <VideoThumbnail />;
        } else if (asset.mimetype === "application/pdf") {
            thumbnail = <Pdf htmlColor="#ce1f19" />;
        } else {
            thumbnail = <ColoredFile />;
        }
    } else {
        thumbnail = <Folder />;
    }

    return <ThumbnailWrapper>{thumbnail}</ThumbnailWrapper>;
};

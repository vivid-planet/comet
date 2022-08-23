import * as React from "react";

import { ImageCrop } from "../../../common/image/ImageCrop";
import { GQLDamFileDetailFragment } from "../../../graphql.generated";

const imageStyle = { maxWidth: "100%", maxHeight: "75vh" };

interface Props {
    file: GQLDamFileDetailFragment;
    onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export function ImagePreview({ file, onError }: Props): JSX.Element {
    return <ImageCrop src={file.fileUrl} imageStyle={imageStyle} onImageError={onError} />;
}

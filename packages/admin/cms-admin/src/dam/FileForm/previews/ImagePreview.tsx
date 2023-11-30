import * as React from "react";

import { ImageCrop } from "../../../common/image/ImageCrop";
import { DamFileDetails } from "../EditFile";

const imageStyle = { maxWidth: "100%", maxHeight: "75vh" };

interface Props {
    file: DamFileDetails;
}

export function ImagePreview({ file }: Props): JSX.Element {
    return <ImageCrop src={file.fileUrl} imageStyle={imageStyle} />;
}

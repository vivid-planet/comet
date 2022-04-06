import { File } from "../../files/entities/file.entity";
import { ImageCropArea } from "../entities/image-crop-area.entity";

export interface ImageInterface {
    file: File;

    cropArea?: ImageCropArea;
}

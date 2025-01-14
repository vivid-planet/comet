import { PixelImageBlock, PreviewSkeleton, PropsWithData, SvgImageBlock, WithPreviewComponent } from "@comet/cms-site";
import { DamImageBlockData, PixelImageBlockData, SvgImageBlockData } from "@src/blocks.generated";
import { ImageProps as NextImageProps } from "next/image";

type DamImageProps = Omit<NextImageProps, "src" | "width" | "height" | "alt"> & {
    aspectRatio: string | "inherit";
};

const InternalDamImageBlock = ({ data: { block }, aspectRatio, ...imageProps }: PropsWithData<DamImageBlockData> & DamImageProps) => {
    if (!block) {
        return <PreviewSkeleton type="media" hasContent={false} />;
    }

    if (block.type === "pixelImage") {
        return <PixelImageBlock data={block.props as PixelImageBlockData} aspectRatio={aspectRatio} {...imageProps} />;
    } else if (block.type === "svgImage") {
        return <SvgImageBlock data={block.props as SvgImageBlockData} />;
    } else {
        return (
            <>
                Unknown block type: <strong>{block.type}</strong>
            </>
        );
    }
};
export const DamImageBlock = (props: PropsWithData<DamImageProps>) => {
    return (
        <WithPreviewComponent data={props.data} label="Image">
            <InternalDamImageBlock {...props} />
        </WithPreviewComponent>
    );
};

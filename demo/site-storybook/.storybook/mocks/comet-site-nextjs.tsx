import type { ComponentType, PropsWithChildren, ReactNode } from "react";

// WithPreviewPropsData type
interface WithPreviewPropsData {
    adminMeta?: { route: string };
}

// WithPreviewProps type
export interface WithPreviewProps {
    data: WithPreviewPropsData;
}

// PropsWithData type
export type PropsWithData<T> = { data: T };

// withPreview mock - identity function that ignores options
export function withPreview<ComponentProps>(
    Component: ComponentType<ComponentProps>,
    _options?: { label?: string },
): ComponentType<WithPreviewProps & ComponentProps> {
    return Component as unknown as ComponentType<WithPreviewProps & ComponentProps>;
}

// PreviewSkeleton mock
export function PreviewSkeleton({ hasContent, title, children }: PropsWithChildren<{ hasContent: boolean; title: ReactNode; type?: string }>) {
    if (hasContent) {
        return <>{children}</>;
    }
    return <>{title}</>;
}

// hasRichTextBlockContent mock
export function hasRichTextBlockContent(data: { draftContent: any }): boolean {
    if (!data || !data.draftContent || !data.draftContent.blocks) {
        return false;
    }
    return data.draftContent.blocks.some((block: any) => block.text && block.text.length > 0);
}

// BlocksBlock mock
export function BlocksBlock({ data, supportedBlocks }: { data: { blocks: Array<{ key: string; type: string; props: any }> }; supportedBlocks: any }) {
    return (
        <>
            {data.blocks.map((block) => {
                const Block = supportedBlocks[block.type];
                if (!Block) {
                    return null;
                }
                return <Block key={block.key} {...block.props} />;
            })}
        </>
    );
}

// SupportedBlocks type
export type SupportedBlocks = Record<string, ComponentType<any>>;

// usePreview mock
export function usePreview() {
    return {
        previewType: "Live" as const,
        isSelected: () => false,
        isHovered: () => false,
    };
}

// isWithPreviewPropsData mock
export function isWithPreviewPropsData(_data: unknown): _data is WithPreviewPropsData {
    return false;
}

// PixelImageBlock mock
export function PixelImageBlock() {
    return <div style={{ background: "#eee", width: "100%", height: 200 }}>Image Placeholder</div>;
}

// SvgImageBlock mock
export function SvgImageBlock() {
    return <div style={{ background: "#eee", width: "100%", height: 200 }}>SVG Placeholder</div>;
}

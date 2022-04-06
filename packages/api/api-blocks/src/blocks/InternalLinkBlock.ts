import { IsOptional, IsString } from "class-validator";

import { BlockData, BlockInput, BlockMetaField, BlockMetaFieldKind, createBlock, inputToData, TransformResponse } from "./block";
import { AnnotationBlockMeta, BlockField } from "./decorators/field";
import { TransformDependencies } from "./dependencies";

interface InternalLinkBlockTransformResponse extends TransformResponse {
    targetPage: {
        id: string;
        name: string;
        path: string;
    } | null;
}

class InternalLinkBlockData extends BlockData {
    targetPageId?: string;

    async transformToPlain({ pageTreeApi }: TransformDependencies): Promise<InternalLinkBlockTransformResponse> {
        if (!pageTreeApi) {
            throw new Error("Missing dependency in: pageTreeApi");
        }

        if (!this.targetPageId) {
            return {
                targetPage: null,
            };
        }

        const node = await pageTreeApi.getNode(this.targetPageId);

        if (!node) {
            return { targetPage: null };
        }

        return {
            targetPage: {
                id: node.id,
                name: node.name,
                path: await pageTreeApi.getNodePath(node),
            },
        };
    }
}

class InternalLinkBlockInput extends BlockInput {
    @IsOptional()
    @IsString()
    @BlockField({ nullable: true })
    // TODO add target page exists validation
    targetPageId?: string;

    transformToBlockData(): InternalLinkBlockData {
        return inputToData(InternalLinkBlockData, this);
    }
}

class Meta extends AnnotationBlockMeta {
    get fields(): BlockMetaField[] {
        return [
            ...super.fields,
            {
                name: "targetPage",
                kind: BlockMetaFieldKind.NestedObject,
                nullable: true,
                object: {
                    fields: [
                        {
                            name: "id",
                            kind: BlockMetaFieldKind.String,
                            nullable: false,
                        },
                        {
                            name: "name",
                            kind: BlockMetaFieldKind.String,
                            nullable: false,
                        },
                        {
                            name: "path",
                            kind: BlockMetaFieldKind.String,
                            nullable: false,
                        },
                    ],
                },
            },
        ];
    }
}

export const InternalLinkBlock = createBlock(InternalLinkBlockData, InternalLinkBlockInput, {
    name: "InternalLink",
    blockMeta: new Meta(InternalLinkBlockData),
});

export type { InternalLinkBlockData, InternalLinkBlockInput };

import {
    AnnotationBlockMeta,
    BlockData,
    BlockField,
    BlockIndexDataArray,
    BlockInput,
    BlockMetaField,
    BlockMetaFieldKind,
    createBlock,
    inputToData,
    TransformResponse,
} from "@comet/blocks-api";
import { IsOptional, IsUUID } from "class-validator";

import { PageTreeService } from "../page-tree.service";
import { PageExists } from "../validators/page-exists.validator";

interface InternalLinkBlockTransformResponse extends TransformResponse {
    targetPage: {
        id: string;
        name: string;
        path: string;
    } | null;
}

class InternalLinkBlockData extends BlockData {
    targetPageId?: string;

    async transformToPlain({ pageTreeService }: { pageTreeService: PageTreeService }): Promise<InternalLinkBlockTransformResponse> {
        if (pageTreeService === undefined) {
            throw new Error("Missing transform dependency pageTreeService!");
        }

        if (!this.targetPageId) {
            return {
                targetPage: null,
            };
        }

        const readApi = pageTreeService.createReadApi({ visibility: "all" });

        const node = await readApi.getNode(this.targetPageId);

        if (!node) {
            return { targetPage: null };
        }

        return {
            targetPage: {
                id: node.id,
                name: node.name,
                path: await readApi.nodePath(node),
            },
        };
    }

    indexData(): BlockIndexDataArray {
        return [
            {
                entityName: "PageTreeNode",
                id: this.targetPageId,
            },
        ];
    }
}

class InternalLinkBlockInput extends BlockInput {
    @BlockField({ nullable: true })
    @IsOptional()
    @IsUUID()
    @PageExists()
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

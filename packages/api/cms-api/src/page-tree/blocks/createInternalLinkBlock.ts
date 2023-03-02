import {
    AnnotationBlockMeta,
    Block,
    BlockData,
    BlockField,
    BlockIndexData,
    BlockInput,
    BlockMetaField,
    BlockMetaFieldKind,
    createBlock,
    inputToData,
    TransformResponse,
} from "@comet/blocks-api";
import { IsOptional, IsString, IsUUID } from "class-validator";

import { PageTreeReadApi } from "../page-tree-read-api";
import { PageExists } from "../validators/page-exists.validator";

interface InternalLinkBlockTransformResponse extends TransformResponse {
    targetPage: {
        id: string;
        name: string;
        path: string;
        documentType: string;
    } | null;
    targetPageAnchor?: string;
}

interface InternalLinkBlockDataInterface extends BlockData {
    targetPageId?: string;
    targetPageAnchor?: string;
}

interface InternalLinkBlockInputInterface extends BlockInput {
    targetPageId?: string;
    targetPageAnchor?: string;
    transformToBlockData: () => InternalLinkBlockDataInterface;
}

interface CreateInternalLinkBlockOptions {
    pageTreeNodeEntityName: string;
}

export function createInternalLinkBlock({
    pageTreeNodeEntityName,
}: CreateInternalLinkBlockOptions): Block<InternalLinkBlockDataInterface, InternalLinkBlockInputInterface> {
    class InternalLinkBlockData extends BlockData {
        targetPageId?: string;

        @BlockField({ nullable: true })
        targetPageAnchor?: string;

        async transformToPlain({ pageTreeReadApi }: { pageTreeReadApi: PageTreeReadApi }): Promise<InternalLinkBlockTransformResponse> {
            if (pageTreeReadApi === undefined) {
                throw new Error("Missing transform dependency pageTreeService!");
            }

            if (!this.targetPageId) {
                return {
                    targetPage: null,
                };
            }

            //TODO do we need createReadApi({ visibility: "all" });?

            const node = await pageTreeReadApi.getNode(this.targetPageId);

            if (!node) {
                return { targetPage: null };
            }

            return {
                targetPage: {
                    id: node.id,
                    name: node.name,
                    path: await pageTreeReadApi.nodePath(node),
                    documentType: node.documentType,
                },
                targetPageAnchor: this.targetPageAnchor,
            };
        }

        indexData(): BlockIndexData {
            return {
                dependencies: [
                    {
                        targetEntityName: pageTreeNodeEntityName,
                        id: this.targetPageId,
                    },
                ],
            };
        }
    }

    class InternalLinkBlockInput extends BlockInput {
        @BlockField({ nullable: true })
        @IsOptional()
        @IsUUID()
        @PageExists()
        targetPageId?: string;

        @BlockField({ nullable: true })
        @IsOptional()
        @IsString()
        targetPageAnchor?: string;

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
                            {
                                name: "documentType",
                                kind: BlockMetaFieldKind.String,
                                nullable: false,
                            },
                        ],
                    },
                },
            ];
        }
    }

    return createBlock(InternalLinkBlockData, InternalLinkBlockInput, {
        name: "InternalLink",
        blockMeta: new Meta(InternalLinkBlockData),
    });
}

export { InternalLinkBlockDataInterface, InternalLinkBlockInputInterface };

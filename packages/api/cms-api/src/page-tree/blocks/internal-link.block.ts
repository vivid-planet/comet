import {
    AnnotationBlockMeta,
    BlockData,
    BlockField,
    BlockIndexData,
    BlockInput,
    BlockMetaField,
    BlockMetaFieldKind,
    createBlock,
    inputToData,
} from "@comet/blocks-api";
import { IsOptional, IsString, IsUUID } from "class-validator";

import { PAGE_TREE_ENTITY } from "../page-tree.constants";
import { PageExists } from "../validators/page-exists.validator";
import { InternalLinkBlockTransformerService } from "./internal-link-block-transformer.service";

class InternalLinkBlockData extends BlockData {
    targetPageId?: string;

    @BlockField({ nullable: true })
    targetPageAnchor?: string;

    async transformToPlain() {
        return InternalLinkBlockTransformerService;
    }

    indexData(): BlockIndexData {
        if (this.targetPageId === undefined) {
            return {};
        }

        return {
            dependencies: [
                {
                    targetEntityName: PAGE_TREE_ENTITY,
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

export const InternalLinkBlock = createBlock(InternalLinkBlockData, InternalLinkBlockInput, {
    name: "InternalLink",
    blockMeta: new Meta(InternalLinkBlockData),
});

export type { InternalLinkBlockData, InternalLinkBlockInput };

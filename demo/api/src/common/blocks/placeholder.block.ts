import {
    AnnotationBlockMeta,
    BlockData,
    BlockField,
    BlockInput,
    blockInputToData,
    BlockMetaField,
    BlockMetaFieldKind,
    createBlock,
    IsUndefinable,
} from "@comet/cms-api";
import { IsEnum, IsString } from "class-validator";

import { PlaceholderBlockTransformerService } from "./placeholder-block-transformer.service";

enum PlaceholderField {
    title = "title",
    price = "price",
}

class PlaceholderBlockData extends BlockData {
    @BlockField({ nullable: true })
    productId?: string;

    @BlockField({ type: "enum", enum: PlaceholderField })
    field: PlaceholderField;

    @BlockField({ nullable: true })
    productTitle?: string;

    @BlockField({ nullable: true })
    productPrice?: string;

    async transformToPlain() {
        return PlaceholderBlockTransformerService;
    }
}

class Meta extends AnnotationBlockMeta {
    get fields(): BlockMetaField[] {
        return [
            ...super.fields,
            {
                name: "value",
                kind: BlockMetaFieldKind.String,
                nullable: true,
            },
        ];
    }
}

class PlaceholderBlockInput extends BlockInput {
    @IsUndefinable()
    @IsString()
    @BlockField({ nullable: true })
    productId?: string;

    @IsEnum(PlaceholderField)
    @BlockField({ type: "enum", enum: PlaceholderField })
    field: PlaceholderField;

    @IsUndefinable()
    @IsString()
    @BlockField({ nullable: true })
    productTitle?: string;

    @IsUndefinable()
    @IsString()
    @BlockField({ nullable: true })
    productPrice?: string;

    transformToBlockData(): PlaceholderBlockData {
        return blockInputToData(PlaceholderBlockData, this);
    }
}

export const PlaceholderBlock = createBlock(PlaceholderBlockData, PlaceholderBlockInput, {
    name: "Placeholder",
    blockMeta: new Meta(PlaceholderBlockData),
});

export { PlaceholderBlockData };

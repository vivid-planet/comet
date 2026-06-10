import { IsBoolean, IsOptional } from "class-validator";

import { BlockData, BlockInput, blockInputToData, createBlock } from "./block";
import { BlockField } from "./decorators/field";
import { BlockMigration } from "./migrations/BlockMigration";
import type { BlockMigrationInterface } from "./migrations/types";
import { typeSafeBlockMigrationPipe } from "./migrations/typeSafeBlockMigrationPipe";
import { IsLinkTarget } from "./validator/is-link-target.validator";

class ExternalLinkBlockData extends BlockData {
    @BlockField({ nullable: true })
    targetUrl?: string;

    @BlockField()
    openInNewWindow: boolean;

    @BlockField()
    noFollow: boolean;
}

class ExternalLinkBlockInput extends BlockInput {
    @IsOptional()
    @IsLinkTarget()
    @BlockField({ nullable: true })
    targetUrl?: string;

    @IsBoolean()
    @BlockField()
    openInNewWindow: boolean;

    @IsBoolean()
    @BlockField()
    noFollow: boolean;

    transformToBlockData(): ExternalLinkBlockData {
        return blockInputToData(ExternalLinkBlockData, this);
    }
}

interface AddNoFollowMigrationFrom {
    targetUrl?: string;
    openInNewWindow: boolean;
}

interface AddNoFollowMigrationTo extends AddNoFollowMigrationFrom {
    noFollow: boolean;
}

class AddNoFollowMigration extends BlockMigration<(from: AddNoFollowMigrationFrom) => AddNoFollowMigrationTo> implements BlockMigrationInterface {
    public readonly toVersion = 1;

    protected migrate(props: AddNoFollowMigrationFrom): AddNoFollowMigrationTo {
        return { ...props, noFollow: false };
    }
}

export const ExternalLinkBlock = createBlock(ExternalLinkBlockData, ExternalLinkBlockInput, {
    name: "ExternalLink",
    migrate: {
        version: 1,
        migrations: typeSafeBlockMigrationPipe([AddNoFollowMigration]),
    },
});

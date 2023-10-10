import { Args, ArgsType, Field, ObjectType, Query, Resolver } from "@nestjs/graphql";
import { IsNumber, IsString } from "class-validator";
import { createHmac, randomBytes } from "crypto";

const sitePreviewSecret = randomBytes(32).toString("hex");

@ObjectType()
@ArgsType()
class SitePreviewHash {
    @Field(() => Number)
    @IsNumber()
    timestamp: number;

    @Field(() => String)
    @IsString()
    hash: string;
}

@Resolver(() => SitePreviewHash)
export class SitePreviewResolver {
    @Query(() => SitePreviewHash)
    getSitePreviewHash(): SitePreviewHash {
        const timestamp = Math.floor(Date.now() / 1000);
        return {
            timestamp,
            hash: this.createHash(timestamp),
        };
    }

    @Query(() => Boolean)
    validateSitePreviewHash(@Args() args: SitePreviewHash): boolean {
        // Timestamp must be within the last 5 minutes
        if (args.timestamp < Math.floor(Date.now() / 1000) - 60 * 5) {
            return false;
        }
        return this.createHash(args.timestamp) === args.hash;
    }

    private createHash(timestamp: number): string {
        if (!timestamp) throw new Error("Timestamp is required");
        return createHmac("sha256", sitePreviewSecret)
            .update(timestamp + sitePreviewSecret)
            .digest("hex");
    }
}

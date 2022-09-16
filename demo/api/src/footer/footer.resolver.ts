import { validateNotModified } from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FooterInput } from "@src/footer/dto/footer.input";
import { GraphQLError } from "graphql";

import { Footer } from "./entities/footer.entity";
import { FooterContentScope } from "./entities/footer-content-scope.entity";

@Resolver(() => Footer)
export class FootersResolver {
    constructor(@InjectRepository(Footer) private readonly footersRepository: EntityRepository<Footer>) {}

    @Query(() => Footer, { nullable: true })
    async footer(@Args("scope", { type: () => FooterContentScope }) scope: FooterContentScope): Promise<Footer | null> {
        const footers = await this.footersRepository.find({ scope });

        if (footers.length > 1) {
            throw new GraphQLError("There must be only one footer");
        }

        return footers.length > 0 ? footers[0] : null;
    }

    @Mutation(() => Footer)
    //TODO move scope out of input into own arg (so it can be validated)
    async saveFooter(
        @Args("input", { type: () => FooterInput }) input: FooterInput,
        @Args("lastUpdatedAt", { type: () => Date, nullable: true }) lastUpdatedAt?: Date,
    ): Promise<Footer> {
        let footer = await this.footersRepository.findOne({ scope: input.scope });

        if (!footer) {
            footer = this.footersRepository.create({ ...input, content: input.content.transformToBlockData() });
        } else if (lastUpdatedAt) {
            validateNotModified(footer, lastUpdatedAt);

            footer.assign({ ...input, content: input.content.transformToBlockData() });
        }

        await this.footersRepository.persistAndFlush(footer);

        return footer;
    }
}

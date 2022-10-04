import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Type } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";

import { PageTreeReadApi } from "../page-tree/page-tree.service";
import { RedirectInterface } from "./entities/redirect-entity";

export function createRedirectsResolver(Redirect: Type<RedirectInterface>): Type<unknown> {
    @Resolver(() => Redirect)
    class RedirectsResolver {
        protected pageTreeReadApi: PageTreeReadApi;

        constructor(@InjectRepository("Redirect") private readonly repository: EntityRepository<RedirectInterface>) {}

        @Query(() => Boolean)
        async redirectSourceAvailable(@Args("source", { type: () => String }) source: string): Promise<boolean> {
            const redirect = await this.repository.findOne({ source });
            return redirect === null;
        }
    }

    return RedirectsResolver;
}

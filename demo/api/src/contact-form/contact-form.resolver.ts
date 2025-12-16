import { DisablePermissionCheck, RequiredPermission } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";

import { ContactFormArgs } from "./contact-form.args";

@Injectable()
@Resolver()
export class ContactFormResolver {
    @RequiredPermission(DisablePermissionCheck, { skipScopeCheck: true })
    @Mutation(() => Boolean)
    async submitContactForm(@Args("input", { type: () => ContactFormArgs }) { ...args }: ContactFormArgs): Promise<boolean> {
        return true;
    }
}

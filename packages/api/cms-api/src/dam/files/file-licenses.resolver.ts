import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { add, compareAsc, getUnixTime } from "date-fns";

import { License } from "./entities/license.embeddable";

const thirtyDaysInSeconds = 60 * 60 * 24 * 30;

@Resolver(() => License)
export class FileLicensesResolver {
    // if durationTo = '2023-02-27T00:00:00.000Z' then the license is still valid on 27.03.2023
    // and expires at '2023-02-28T00:00:00.000Z'
    @ResolveField(() => Date, { nullable: true, description: "The expirationDate is the durationTo + 1 day" })
    async expirationDate(@Parent() license: License): Promise<Date | undefined> {
        if (license.durationTo) {
            return add(license.durationTo, {
                days: 1,
            });
        }
        return undefined;
    }

    @ResolveField(() => Boolean)
    async isNotValidYet(@Parent() license: License): Promise<boolean> {
        const currentDate = new Date();

        if (license.durationFrom && compareAsc(currentDate, license.durationFrom) === -1) {
            return true;
        }
        return false;
    }

    @ResolveField(() => Boolean)
    async expiresWithinThirtyDays(@Parent() license: License): Promise<boolean> {
        const currentDate = new Date();
        const expirationDate = await this.expirationDate(license);
        const differenceBetweenExpirationDateAndNow = expirationDate ? getUnixTime(expirationDate) - getUnixTime(currentDate) : null;

        if (
            differenceBetweenExpirationDateAndNow !== null &&
            differenceBetweenExpirationDateAndNow > 0 &&
            differenceBetweenExpirationDateAndNow <= thirtyDaysInSeconds
        ) {
            return true;
        }
        return false;
    }

    @ResolveField(() => Boolean)
    async hasExpired(@Parent() license: License): Promise<boolean> {
        const currentDate = new Date();
        const expirationDate = await this.expirationDate(license);

        if (expirationDate && compareAsc(currentDate, expirationDate) === 1) {
            return true;
        }
        return false;
    }

    @ResolveField(() => Boolean)
    async isValid(@Parent() license: License): Promise<boolean> {
        const isNotValidYet = await this.isNotValidYet(license);
        const hasExpired = await this.hasExpired(license);

        if (isNotValidYet || hasExpired) {
            return false;
        }
        return true;
    }
}

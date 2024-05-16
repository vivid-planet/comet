import { RequiredPermission } from "@comet/cms-api";
import { FindOptions } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { ManufacturerCountriesArgs } from "@src/products/dto/manufacturer-countries.args";
import { PaginatedManufacturerCountries } from "@src/products/dto/paginated-manufacturer-countries";
import { ManufacturerCountry } from "@src/products/entities/manufacturer-country.entity";

import { Manufacturer } from "./entities/manufacturer.entity";
import { ManufacturerCountriesService } from "./manufacturer-countries.service";

@Resolver(() => Manufacturer)
@RequiredPermission(["manufacturers"], { skipScopeCheck: true })
export class ManufacturerCountryResolver {
    constructor(
        private readonly manufacturerCountriesService: ManufacturerCountriesService,
        @InjectRepository(ManufacturerCountry) private readonly repository: EntityRepository<ManufacturerCountry>,
    ) {}

    @Query(() => PaginatedManufacturerCountries)
    async manufacturerCountries(@Args() { search, filter, offset, limit }: ManufacturerCountriesArgs): Promise<PaginatedManufacturerCountries> {
        const where = this.manufacturerCountriesService.getFindCondition({ search, filter });

        const options: FindOptions<ManufacturerCountry> = { offset, limit };

        const [entities, totalCount] = await this.repository.findAndCount(where, options);
        return new PaginatedManufacturerCountries(entities, totalCount);
    }
}

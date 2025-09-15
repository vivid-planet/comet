import { FileUpload } from "@comet/cms-api";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { CustomProductResolver } from "./custom-product.resolver";
import { Manufacturer } from "./entities/manufacturer.entity";
import { ManufacturerCountry } from "./entities/manufacturer-country.entity";
import { Product } from "./entities/product.entity";
import { ProductCategory } from "./entities/product-category.entity";
import { ProductColor } from "./entities/product-color.entity";
import { ProductHighlight } from "./entities/product-highlight.entity";
import { ProductStatistics } from "./entities/product-statistics.entity";
import { ProductTag } from "./entities/product-tag.entity";
import { ProductToTag } from "./entities/product-to-tag.entity";
import { ProductVariant } from "./entities/product-variant.entity";
import { ManufacturerResolver } from "./generated/manufacturer.resolver";
import { ManufacturerCountryResolver } from "./generated/manufacturer-country.resolver";
import { ProductResolver } from "./generated/product.resolver";
import { ProductCategoriesService } from "./generated/product-categories.service";
import { ProductCategoryResolver } from "./generated/product-category.resolver";
import { ProductColorResolver } from "./generated/product-color.resolver";
import { ProductHighlightResolver } from "./generated/product-highlight.resolver";
import { ProductTagResolver } from "./generated/product-tag.resolver";
import { ProductToTagResolver } from "./generated/product-to-tag.resolver";
import { ProductVariantResolver } from "./generated/product-variant.resolver";
import { ProductVariantsService } from "./generated/product-variants.service";
import { ProductPublishedMail } from "./product-published.mail";

@Module({
    imports: [
        MikroOrmModule.forFeature([
            Product,
            ProductCategory,
            ProductTag,
            ProductToTag,
            ProductVariant,
            ProductStatistics,
            ProductColor,
            Manufacturer,
            FileUpload,
            ManufacturerCountry,
            ProductHighlight,
        ]),
    ],
    providers: [
        ProductResolver,
        ProductCategoryResolver,
        ProductCategoriesService,
        ProductTagResolver,
        ProductVariantResolver,
        ProductVariantsService,
        ManufacturerResolver,
        ManufacturerCountryResolver,
        ProductToTagResolver,
        ProductColorResolver,
        CustomProductResolver,
        ProductHighlightResolver,
        ProductPublishedMail,
    ],
    exports: [],
})
export class ProductsModule {}

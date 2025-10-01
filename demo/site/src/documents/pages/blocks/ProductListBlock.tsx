import { type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type ProductListBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";

export const ProductListBlock = withPreview(
    ({ data: { products } }: PropsWithData<ProductListBlockData>) => {
        return (
            <PageLayout grid>
                <ul>
                    {(Array.isArray(products) ? products : [products]).map((product) => (
                        <li key={product.key}>{product}</li>
                    ))}
                </ul>
            </PageLayout>
        );
    },
    {
        label: "ProductList",
    },
);

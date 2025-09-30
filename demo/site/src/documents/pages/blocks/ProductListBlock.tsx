import { type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type ProductListBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";

export const ProductListBlock = withPreview(
    ({ data: { products } }: PropsWithData<ProductListBlockData>) => {
        return (
            <PageLayout grid>
                <ul>
                    {products.map((product, idx) => (
                        <li key={idx}>{JSON.stringify(product)}</li>
                    ))}
                </ul>
            </PageLayout>
        );
    },
    {
        label: "ProductList",
    },
);

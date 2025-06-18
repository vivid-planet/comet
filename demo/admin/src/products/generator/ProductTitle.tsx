import { FormattedMessage } from "react-intl";

export function ProductTitle({ title }: { title: string }) {
    return (
        <div>
            <FormattedMessage id="products.grid.cells.title" defaultMessage="Product: {title}" values={{ title }} />
        </div>
    );
}

export function formatPrice(price: string | undefined, locale = "de-DE", currency = "EUR"): string | undefined {
    if (price == null) return undefined;
    const num = Number(price);
    if (isNaN(num)) return price;
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(num);
}

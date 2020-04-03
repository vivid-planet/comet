type Start = number;
type Offset = number;
type Range = [Start, Offset];

export default function rangesIntersect(a: Range, b: Range, positiveWhenRangesTouch = true): boolean {
    const [aStart, aOffset] = a;
    const [bStart, bOffset] = b;

    // returns true when the 2 lines intersect
    if (positiveWhenRangesTouch) {
        return !(aStart >= bOffset || aOffset <= bStart);
    } else {
        return !(aStart > bOffset || aOffset < bStart);
    }
}

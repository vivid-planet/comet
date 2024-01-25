// https://stackoverflow.com/a/58436959

// export type DeepKeyOf<T> = T extends object
//     ? {
//           [K in keyof T]: `${Exclude<K, symbol>}${DeepKeyOf<T[K]> extends never ? "" : `.${DeepKeyOf<T[K]>}`}`;
//       }[keyof T]
//     : never;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]];
type Join<K, P> = K extends string | number ? (P extends string | number ? `${K}${"" extends P ? "" : "."}${P}` : never) : never;
export type DeepKeyOf<T, D extends number = 10> = [D] extends [never]
    ? never
    : T extends object
    ? { [K in keyof T]-?: Join<K, DeepKeyOf<T[K], Prev[D]>> }[keyof T]
    : "";

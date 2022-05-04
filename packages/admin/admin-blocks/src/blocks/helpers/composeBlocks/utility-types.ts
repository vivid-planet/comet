/* eslint-disable @typescript-eslint/no-explicit-any */

// https://stackoverflow.com/a/54520829
// extracts from an interface T those keys, where its value matches the type V
export type KeysMatching<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];

// https://stackoverflow.com/a/51438474
// Flattens an interface
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Flatten<T> = UnionToIntersection<T[keyof T]>;

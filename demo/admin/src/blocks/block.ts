import { z } from "zod";

// ── Primitive field definitions ─────────────────────────────────────────────

export interface NumberFieldDef {
    readonly _tag: "number";
    toZodType(): z.ZodNumber;
}

export interface StringFieldDef {
    readonly _tag: "string";
    toZodType(): z.ZodString;
}

export interface BooleanFieldDef {
    readonly _tag: "boolean";
    toZodType(): z.ZodBoolean;
}

// Block-reference field: Zod delegates to the child block's schema.
export interface BlockRefFieldDef<B extends BlockDef<string, Record<string, FieldDef>, Record<string, unknown>, unknown>> {
    readonly _tag: "block";
    readonly block: B;
    toZodType(): z.ZodTypeAny; // broad return type avoids circular reference through FieldsToZodShape
}

export type FieldDef =
    | NumberFieldDef
    | StringFieldDef
    | BooleanFieldDef
    | BlockRefFieldDef<BlockDef<string, Record<string, FieldDef>, Record<string, unknown>, unknown>>;

// ── Internal type helpers ───────────────────────────────────────────────────

type FieldsToZodShape<TFields extends Record<string, FieldDef>> = {
    [K in keyof TFields]: ReturnType<TFields[K]["toZodType"]>;
};

// Maps a FieldDef to its runtime data type (for block input/stored data):
type FieldDefToBlockData<F extends FieldDef> = F extends NumberFieldDef
    ? number
    : F extends StringFieldDef
      ? string
      : F extends BooleanFieldDef
        ? boolean
        : F extends BlockRefFieldDef<infer B>
          ? BlockData<B>
          : never;

// ── BlockDef ────────────────────────────────────────────────────────────────

export interface BlockDef<TName extends string, TFields extends Record<string, FieldDef>, TOutput extends Record<string, unknown>, TContext = void> {
    readonly name: TName;
    readonly schema: z.ZodObject<FieldsToZodShape<TFields>>; // Zod; also used for runtime validation
    readonly toOutput: (data: { [K in keyof TFields]: FieldDefToBlockData<TFields[K]> }, context: TContext) => Promise<TOutput>;
}

// BlockData = input + stored type, computed from fields via FieldDefToBlockData (not z.infer, to avoid circularity):
export type BlockData<B extends BlockDef<string, Record<string, FieldDef>, Record<string, unknown>, unknown>> =
    B extends BlockDef<string, infer TFields, Record<string, unknown>, unknown> ? { [K in keyof TFields]: FieldDefToBlockData<TFields[K]> } : never;

// OutputData = output type, inferred from toOutput return:
export type OutputData<B extends BlockDef<string, Record<string, FieldDef>, Record<string, unknown>, unknown>> = Awaited<ReturnType<B["toOutput"]>>;

// ── Field builders ──────────────────────────────────────────────────────────

export const blockField = {
    number: (): NumberFieldDef => ({ _tag: "number", toZodType: () => z.number() }),
    string: (): StringFieldDef => ({ _tag: "string", toZodType: () => z.string() }),
    boolean: (): BooleanFieldDef => ({ _tag: "boolean", toZodType: () => z.boolean() }),
    block: <B extends BlockDef<string, Record<string, FieldDef>, Record<string, unknown>, unknown>>(childBlock: B): BlockRefFieldDef<B> => ({
        _tag: "block",
        block: childBlock,
        toZodType: () => childBlock.schema,
    }),
};

// ── defineBlock ─────────────────────────────────────────────────────────────

function makeSchema<TFields extends Record<string, FieldDef>>(fields: TFields): z.ZodObject<FieldsToZodShape<TFields>> {
    const shape = Object.fromEntries(Object.entries(fields).map(([k, f]) => [k, f.toZodType()])) as FieldsToZodShape<TFields>;
    return z.object(shape);
}

export function defineBlock<TName extends string, TFields extends Record<string, FieldDef>, TOutput extends Record<string, unknown>, TContext = void>(
    name: TName,
    config: {
        fields: TFields;
        toOutput: (data: { [K in keyof TFields]: FieldDefToBlockData<TFields[K]> }, context: TContext) => Promise<TOutput>;
    },
): BlockDef<TName, TFields, TOutput, TContext> {
    return {
        name,
        schema: makeSchema(config.fields),
        toOutput: config.toOutput,
    };
}

// Convenience: when input/stored and output are the same (identity toOutput).
// Only valid when all nested block references also have identity toOutput.
export function blockFields<TFields extends Record<string, FieldDef>>(
    fields: TFields,
): {
    fields: TFields;
    toOutput: (data: { [K in keyof TFields]: FieldDefToBlockData<TFields[K]> }) => Promise<{ [K in keyof TFields]: FieldDefToBlockData<TFields[K]> }>;
} {
    return { fields, toOutput: async (data) => data };
}

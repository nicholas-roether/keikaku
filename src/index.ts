const enum TypeId {
	STRING,
	NUMBER,
	BOOLEAN,
	BIGINT,
	NULL,
	UNDEFINED,
	UNKNOWN,
	OBJECT,
}

const enum TypeOperation {
	UNION,
	INTERSECTION,
}

const SYM_TYPE_ID = Symbol("type_id");
const SYM_KEY_SCHEMA = Symbol("key_schema");
const SYM_VALUE_SCHEMA = Symbol("value_schema");
const SYM_TYPE_OP = Symbol("typeop");
const SYM_OPTIONAL = Symbol("optional");
const SYM_NULLABLE = Symbol("nullable");
const SYM_ARRAY = Symbol("array");

declare const SYM_VIRTUAL_TYPE_MARKER: unique symbol;

type Schema<T> = SchemaContent & { [SYM_VIRTUAL_TYPE_MARKER]: T };

type SchemaType<S extends Schema<unknown>> = S[typeof SYM_VIRTUAL_TYPE_MARKER];

type ScalarSchemaContent = {
	[SYM_TYPE_ID]: TypeId;
	[SYM_OPTIONAL]?: boolean;
	[SYM_NULLABLE]?: boolean;
	[SYM_ARRAY]?: boolean;
	[SYM_KEY_SCHEMA]?: Schema<string | number>;
	[SYM_VALUE_SCHEMA]?: Schema<unknown>;
	[property: string]: Schema<unknown>;
};

type OperationSchemaContent = Schema<unknown>[] & {
	[SYM_TYPE_OP]: TypeOperation;
};

type SchemaContent = ScalarSchemaContent | OperationSchemaContent;

const t = {
	string: { [SYM_TYPE_ID]: TypeId.STRING } as Schema<string>,
	number: { [SYM_TYPE_ID]: TypeId.NUMBER } as Schema<number>,
	boolean: { [SYM_TYPE_ID]: TypeId.BOOLEAN } as Schema<boolean>,
	bigint: { [SYM_TYPE_ID]: TypeId.BIGINT } as Schema<bigint>,
	null: { [SYM_TYPE_ID]: TypeId.NULL } as Schema<null>,
	undefined: { [SYM_TYPE_ID]: TypeId.UNDEFINED } as Schema<undefined>,
	unknown: { [SYM_TYPE_ID]: TypeId.UNKNOWN } as Schema<unknown>,

	object<R extends Record<string | number, Schema<unknown>>>(
		properties: R,
	): Schema<{ [K in keyof R]: SchemaType<R[K]> }> {
		return {
			...properties,
			[SYM_TYPE_ID]: TypeId.OBJECT,
		} as unknown as Schema<any>;
	},

	record<K extends string | number, V>(
		keys: Schema<K>,
		values: Schema<V>,
	): Schema<Record<K, V>> {
		return {
			[SYM_TYPE_ID]: TypeId.OBJECT,
			[SYM_KEY_SCHEMA]: keys,
			[SYM_VALUE_SCHEMA]: values,
		} as unknown as Schema<Record<K, V>>;
	},

	optional<T>(schema: Schema<T>): Schema<T | undefined> {
		return { ...schema, [SYM_OPTIONAL]: true } as Schema<T | undefined>;
	},

	nullable<T>(schema: Schema<T>): Schema<T | null> {
		return { ...schema, [SYM_NULLABLE]: true } as Schema<T | null>;
	},

	array<T>(schema: Schema<T>): Schema<T[]> {
		return { ...schema, [SYM_ARRAY]: true } as Schema<T[]>;
	},

	union<A extends Schema<unknown>[]>(
		...items: A
	): Schema<
		{
			[K in keyof A & number]: SchemaType<A[K]>;
		}[keyof A & number]
	> {
		const union: OperationSchemaContent = [
			...items,
		] as OperationSchemaContent;
		union[SYM_TYPE_OP] = TypeOperation.UNION;
		return union as Schema<any>;
	},
};

const mySchema = t.object({
	value: t.union(t.string, t.number, t.boolean),
	record: t.record(t.string, t.unknown),
});

type Test = SchemaType<typeof mySchema>;

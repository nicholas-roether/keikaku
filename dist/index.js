"use strict";
const SYM_TYPE_ID = Symbol("type_id");
const SYM_KEY_SCHEMA = Symbol("key_schema");
const SYM_VALUE_SCHEMA = Symbol("value_schema");
const SYM_TYPE_OP = Symbol("typeop");
const SYM_OPTIONAL = Symbol("optional");
const SYM_NULLABLE = Symbol("nullable");
const SYM_ARRAY = Symbol("array");
const t = {
    string: { [SYM_TYPE_ID]: 0 /* TypeId.STRING */ },
    number: { [SYM_TYPE_ID]: 1 /* TypeId.NUMBER */ },
    boolean: { [SYM_TYPE_ID]: 2 /* TypeId.BOOLEAN */ },
    bigint: { [SYM_TYPE_ID]: 3 /* TypeId.BIGINT */ },
    null: { [SYM_TYPE_ID]: 4 /* TypeId.NULL */ },
    undefined: { [SYM_TYPE_ID]: 5 /* TypeId.UNDEFINED */ },
    unknown: { [SYM_TYPE_ID]: 6 /* TypeId.UNKNOWN */ },
    object(properties) {
        return {
            ...properties,
            [SYM_TYPE_ID]: 7 /* TypeId.OBJECT */,
        };
    },
    record(keys, values) {
        return {
            [SYM_TYPE_ID]: 7 /* TypeId.OBJECT */,
            [SYM_KEY_SCHEMA]: keys,
            [SYM_VALUE_SCHEMA]: values,
        };
    },
    optional(schema) {
        return { ...schema, [SYM_OPTIONAL]: true };
    },
    nullable(schema) {
        return { ...schema, [SYM_NULLABLE]: true };
    },
    array(schema) {
        return { ...schema, [SYM_ARRAY]: true };
    },
    union(...items) {
        const union = [
            ...items,
        ];
        union[SYM_TYPE_OP] = 0 /* TypeOperation.UNION */;
        return union;
    },
};
const mySchema = t.object({
    value: t.union(t.string, t.number, t.boolean),
    record: t.record(t.string, t.unknown),
});

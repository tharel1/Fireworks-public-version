type MarkFunctionProperties<T> = {
  [Key in keyof T]: T[Key] extends Function ? never : Key;
};

type ExcludeFunctionPropertyNames<T> = MarkFunctionProperties<T>[keyof T];

type ExcludeFunctions<T> = Pick<T, ExcludeFunctionPropertyNames<T>>;

export type JsonType<T, Props = ExcludeFunctions<T>> = {
  [Key in keyof Props]: any
};

export interface PlainJson<T> {
  toJson(): JsonType<T>;
}

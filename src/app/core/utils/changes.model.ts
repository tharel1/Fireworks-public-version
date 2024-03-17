type MarkFunctionProperties<T> = {
  [Key in keyof T]: T[Key] extends Function ? never : Key;
};

type ExcludeFunctionPropertyNames<T> = MarkFunctionProperties<T>[keyof T];

type ExcludeFunctions<T> = Pick<T, ExcludeFunctionPropertyNames<T>>;

export type Changes<T, Props = ExcludeFunctions<T>> = {
  [Key in keyof Props]: {
    previousValue: Props[Key];
    currentValue: Props[Key];
    firstChange: boolean;
    isFirstChange(): boolean;
  }
};

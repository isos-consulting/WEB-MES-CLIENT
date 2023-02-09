export const isUndefined = (value: unknown): value is undefined => {
  return typeof value === 'undefined';
};

export const isNull = (value: unknown): value is null => {
  return value === null;
};

export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean';
};

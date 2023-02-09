export const isUndefined = (value: unknown): value is undefined => {
  return typeof value === 'undefined';
};

export const isNull = (value: unknown): value is null => {
  return value === null;
};

export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean';
};

export const isNil = (value: unknown): value is null | undefined => {
  return isUndefined(value) || isNull(value);
};
/**
 * check the emptiness(included null) of object or array. if obj parameter is null or undefind, return true
 * @param obj - target object or array
 * @returns the emptiness of obj
 */
export function isEmpty(obj: any) {
  return (
    isNull(obj) ||
    isUndefined(obj) ||
    (!isUndefined(obj.length) && obj.length === 0) ||
    Object.keys(obj).length === 0
  );
}

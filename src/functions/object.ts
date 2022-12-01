export const nullify = (target: object) =>
  Object.keys(target).reduce((copy, key) => {
    copy[key] = null;
    return copy;
  }, {});

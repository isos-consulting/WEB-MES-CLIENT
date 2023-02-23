export const arrayToEntities = <Type>(
  datas: unknown[],
  entity: { new (data: unknown): Type },
): Type[] => {
  return datas.map(data => new entity(data));
};

export const objectToEntity = <Type>(
  data: unknown,
  entity: { new (data: unknown): Type },
): Type => {
  return new entity(data);
};

import { nullify } from '../../src/functions/object';

test('원본 오브젝트의 값을 전부 null로 할당한 사본을 만드는 테스트', () => {
  const obj = { a: 1, b: 2, c: 3 };
  const copy = nullify(obj);
  expect(copy).toEqual({ a: null, b: null, c: null });
  expect(copy).not.toBe(obj);
});

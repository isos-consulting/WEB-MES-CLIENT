import { getWeeksAtMonth } from '~/functions/date.function';

test('2023-01은 1~5를 포함한 배열을 반환한다', () => {
  const weeks = getWeeksAtMonth('2023-01');

  expect(weeks).toEqual([1, 2, 3, 4, 5]);
});

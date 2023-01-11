import {
  getRangeDateAtFiftyThreeWeeks,
  getRangeDateAtMonth,
  getRangeDateAtMonthForWeek,
  getWeeksAtMonth,
} from '~/functions/date.function';

test('2023-01은 1~5를 포함한 배열을 반환한다', () => {
  const weeks = getWeeksAtMonth('2023-01');

  expect(weeks).toEqual([1, 2, 3, 4, 5]);
});

test('2023-12은 48~53를 포함한 배열을 반환한다', () => {
  const weeks = getWeeksAtMonth('2023-12');

  expect(weeks).toEqual([48, 49, 50, 51, 52, 53]);
});

test('getWeeksMonth 함수는 month 인자가 없으면 에러를 발생시킨다', () => {
  expect(() => getWeeksAtMonth(null)).toThrowError(
    'month is null or undefined',
  );
});

test('getWeeksMonth 함수는 month 인자가 유효하지 않으면 에러를 발생시킨다', () => {
  expect(() => getWeeksAtMonth('2023-13')).toThrowError(
    'month is invalid date',
  );
});

test('2023년 1월 5주차는 1월 29~31일을 포함한 배열을 반환한다', () => {
  const dates = getRangeDateAtMonthForWeek(2023, 1, 5);

  expect(dates).toEqual([29, 30, 31]);
});

test('2023년 5주차는 2월의 1~4일을 포함한 배열을 반환한다', () => {
  const dates = getRangeDateAtMonthForWeek(2023, 2, 5);

  expect(dates).toEqual([1, 2, 3, 4]);
});

test('2023년 53주차는 12월의 31일을 포함한 배열을 반환한다', () => {
  const dates = getRangeDateAtFiftyThreeWeeks(2023);

  expect(dates).toEqual([31]);
});

test('getRangeDateAtMonthForWeek 함수는 year 인자가 없으면 에러를 발생시킨다', () => {
  expect(() => getRangeDateAtMonthForWeek(null, 1, 1)).toThrowError(
    'year is null or undefined',
  );
});

test('getRangeDateAtMonthForWeek 함수는 month 인자가 없으면 에러를 발생시킨다', () => {
  expect(() => getRangeDateAtMonthForWeek(2023, null, 1)).toThrowError(
    'month is null or undefined',
  );
});

test('getRangeDateAtMonthForWeek 함수는 week 인자가 없으면 에러를 발생시킨다', () => {
  expect(() => getRangeDateAtMonthForWeek(2023, 1, null)).toThrowError(
    'week is null or undefined',
  );
});

test('2023년 1월은 1~31일을 포함한 배열을 반환한다', () => {
  const dates = getRangeDateAtMonth('2023-01');

  expect(dates).toEqual([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ]);
});

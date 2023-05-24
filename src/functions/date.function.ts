import moment from 'moment';
import { isNil } from '~/helper/common';

enum DateType {
  'year' = 'year',
  'month' = 'month',
  'week' = 'week',
  'day' = 'day',
  'hour' = 'hour',
  'minute' = 'minute',
  'second' = 'second',
  'millisecond' = 'millisecond',
}

class DateArgumentsNullPointException extends Error {
  constructor(arg: DateType) {
    super(`${arg} is null or undefined`);
  }
}

class MonthInvalidException extends Error {
  constructor() {
    super('month is invalid date');
  }
}

export const getWeeksAtMonth = month => {
  if (isNil(month)) throw new DateArgumentsNullPointException(DateType.month);
  const momentConvertedMonth = moment(month);

  if (momentConvertedMonth.isValid() === false)
    throw new MonthInvalidException();

  const firstWeek = moment(momentConvertedMonth).startOf('month').week();
  const lastWeek = moment(momentConvertedMonth).endOf('month').week();

  if (lastWeek === 1)
    return Array.from({ length: 53 - firstWeek + 1 }, (_v, i) => i + firstWeek);

  return Array.from(
    { length: lastWeek - firstWeek + 1 },
    (_v, i) => i + firstWeek,
  );
};

export const getRangeDateAtMonthForWeek = (year, month, week) => {
  if (isNil(year)) throw new DateArgumentsNullPointException(DateType.year);
  if (isNil(month)) throw new DateArgumentsNullPointException(DateType.month);
  if (isNil(week)) throw new DateArgumentsNullPointException(DateType.week);
  if (week === 53) return getRangeDateAtFiftyThreeWeeks(year);

  const momentConvertedWeek = moment().locale('ko').year(year).week(week);

  const startOfDateForWeek = momentConvertedWeek
    .startOf('week')
    .format('YYYY-MM-DD');
  const endOfDateForWeek = momentConvertedWeek
    .endOf('week')
    .format('YYYY-MM-DD');

  const momentDurationAsDays = moment
    .duration(moment(endOfDateForWeek).diff(moment(startOfDateForWeek)))
    .asDays();

  const dates = Array.from({ length: momentDurationAsDays + 1 }, (_v, i) =>
    moment(startOfDateForWeek).add(i, 'days'),
  );

  const momentConvertedMonth = moment()
    .locale('ko')
    .year(year)
    .month(month - 1);
  const startOfDateForMonth = momentConvertedMonth
    .startOf('month')
    .format('YYYY-MM-DD');
  const endOfDateForMonth = momentConvertedMonth
    .endOf('month')
    .format('YYYY-MM-DD');

  const filteredDates = dates.filter(
    date =>
      moment(date).isSameOrAfter(moment(startOfDateForMonth)) &&
      moment(date).isSameOrBefore(moment(endOfDateForMonth)),
  );

  return filteredDates.map(date => date.date());
};

export const getRangeDateAtFiftyThreeWeeks = year => {
  if (isNil(year)) throw new DateArgumentsNullPointException(DateType.year);

  const momentConvertedYear = moment().locale('ko').year(year);
  const momentConvertedLastWeek = moment().locale('ko').year(year).week(52);

  const endOfDateForYear = momentConvertedYear
    .endOf('year')
    .format('YYYY-MM-DD');

  const endOfDateForLastWeek = momentConvertedLastWeek
    .endOf('week')
    .format('YYYY-MM-DD');

  const momentDurationAsDays = moment
    .duration(moment(endOfDateForYear).diff(moment(endOfDateForLastWeek)))
    .asDays();

  const dates = Array.from({ length: momentDurationAsDays }, (_v, i) =>
    moment(endOfDateForLastWeek).add(i + 1, 'days'),
  );

  return dates.map(date => date.date());
};

export const getRangeDateAtMonth = month => {
  if (isNil(month)) throw new DateArgumentsNullPointException(DateType.month);

  const momentConvertedMonth = moment(month);

  if (momentConvertedMonth.isValid() === false)
    throw new MonthInvalidException();

  const startOfDateForMonth = momentConvertedMonth
    .startOf('month')
    .format('YYYY-MM-DD');

  const endOfDateForMonth = momentConvertedMonth
    .endOf('month')
    .format('YYYY-MM-DD');

  const momentDurationAsDays = moment
    .duration(moment(endOfDateForMonth).diff(moment(startOfDateForMonth)))
    .asDays();

  const dates = Array.from({ length: momentDurationAsDays + 1 }, (_v, i) =>
    moment(startOfDateForMonth).add(i, 'days'),
  );

  return dates.map(date => date.date());
};

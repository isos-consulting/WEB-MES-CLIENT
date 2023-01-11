import moment from 'moment';

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
  if (month == null) throw new DateArgumentsNullPointException(DateType.month);
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
  if (year == null) throw new DateArgumentsNullPointException(DateType.year);
  if (month == null) throw new DateArgumentsNullPointException(DateType.month);
  if (week == null) throw new DateArgumentsNullPointException(DateType.week);
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

  const filterdDates = dates.filter(
    date =>
      moment(date).isSameOrAfter(moment(startOfDateForMonth)) &&
      moment(date).isSameOrBefore(moment(endOfDateForMonth)),
  );

  return filterdDates.map(date => date.date());
};

export const getRangeDateAtFiftyThreeWeeks = year => {
  if (year == null) throw new DateArgumentsNullPointException(DateType.year);

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

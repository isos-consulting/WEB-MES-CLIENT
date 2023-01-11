import moment from 'moment';

export const getWeeksAtMonth = month => {
  if (month == null) throw new Error('month is null or undefined');
  const momentConvertedMonth = moment(month);

  if (momentConvertedMonth.isValid() === false)
    throw new Error('month is invalid date');

  const firstWeek = moment(momentConvertedMonth).startOf('month').week();
  const lastWeek = moment(momentConvertedMonth).endOf('month').week();

  return Array.from(
    { length: lastWeek - firstWeek + 1 },
    (_v, i) => i + firstWeek,
  );
};

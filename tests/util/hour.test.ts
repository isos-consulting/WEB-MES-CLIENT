import EXPRESSIONS from '../../src/constants/expressions';

describe('Hour Minute Test', () => {
  test('H:mm', () => {
    expect(EXPRESSIONS.HOUR_MINUTE.test('1:00')).toBe(true);
    expect(EXPRESSIONS.HOUR_MINUTE.test('9:59')).toBe(true);
    expect(EXPRESSIONS.HOUR_MINUTE.test('1:0')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE.test('1:000')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE.test('0')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE.test('0:0')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE.test('0:00')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE.test('0:001')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE.test('1')).toBe(false);
  });

  test('HH:mm', () => {
    expect(EXPRESSIONS.HOUR_MINUTE.test('01:00')).toBe(true);
    expect(EXPRESSIONS.HOUR_MINUTE.test('00:00')).toBe(true);
    expect(EXPRESSIONS.HOUR_MINUTE.test('00:59')).toBe(true);
    expect(EXPRESSIONS.HOUR_MINUTE.test('23:59')).toBe(true);
    expect(EXPRESSIONS.HOUR_MINUTE.test('0:00')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE.test('1')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE.test('01')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE.test('01:0')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE.test('00:000')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE.test('00:010')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE.test('000:00')).toBe(false);
  });

  test('00:00 ~ 23:59', () => {
    expect(EXPRESSIONS.HOUR_MINUTE.test('00:00')).toBe(true);
    expect(EXPRESSIONS.HOUR_MINUTE.test('09:01')).toBe(true);
    expect(EXPRESSIONS.HOUR_MINUTE.test('10:00')).toBe(true);
    expect(EXPRESSIONS.HOUR_MINUTE.test('19:59')).toBe(true);
    expect(EXPRESSIONS.HOUR_MINUTE.test('20:00')).toBe(true);
    expect(EXPRESSIONS.HOUR_MINUTE.test('23:00')).toBe(true);
    expect(EXPRESSIONS.HOUR_MINUTE.test('23:59')).toBe(true);
    expect(EXPRESSIONS.HOUR_MINUTE.test('09:60')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE.test('23:60')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE.test('24:00')).toBe(false);
  });
});

describe('Hour Minute Second Test', () => {
  test('H:mm:ss', () => {
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('1:00:00')).toBe(true);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('9:59:59')).toBe(true);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('1')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('1:0')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('1:00')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('1:00:0')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('1:000:00')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('1:00:000')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('0')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('0:0')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('0:00')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('0:001')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('0:0:00')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('0:00:00')).toBe(false);
  });

  test('HH:mm:ss', () => {
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('01:00:00')).toBe(true);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('00:00:00')).toBe(true);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('00:59:59')).toBe(true);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('23:59:59')).toBe(true);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('0:00')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('1')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('01')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('00:0')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('00:000')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('00:00:0')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('00:00:000')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('00:0:00')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('0:0:00')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('00:010')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('000:00')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('000:00:00')).toBe(false);
  });

  test('00:00:00 ~ 23:59:59', () => {
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('00:00:00')).toBe(true);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('09:59:59')).toBe(true);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('10:00:00')).toBe(true);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('19:59:00')).toBe(true);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('20:00:00')).toBe(true);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('23:00:00')).toBe(true);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('23:59:00')).toBe(true);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('00:60:00')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('00:00:60')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('09:60:00')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('09:00:60')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('10:60:00')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('10:00:60')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('19:60:00')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('19:00:60')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('23:60:00')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('23:00:60')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('24:00:00')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('24:59:00')).toBe(false);
    expect(EXPRESSIONS.HOUR_MINUTE_SECOND.test('24:59:59')).toBe(false);
  });
});

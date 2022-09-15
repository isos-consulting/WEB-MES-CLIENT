import { isNumber } from '../../src/functions/number';

describe('순차적인 숫자(sequencial)', () => {
  test('순차적인 숫자는 인식한다', () => {
    expect(isNumber('1')).toBe(true);
    expect(isNumber('12')).toBe(true);
    expect(isNumber('123')).toBe(true);
  });
});

describe('지수 표현 방식(e)', () => {
  test('지수 표현 방식(e) 숫자 인식 하지 못한다', () => {
    expect(isNumber('1e1')).toBe(false);
    expect(isNumber('1e2')).toBe(false);
    expect(isNumber('1e3')).toBe(false);
    expect(isNumber('e1')).toBe(false);
    expect(isNumber('12e')).toBe(false);
  });
  test('javascript 내장 객체는 지수 표현 방식(e) 숫자를 인식한다', () => {
    expect(Number.isNaN(1e1)).toBe(false);
    expect(Number.isNaN(1e2)).toBe(false);
    expect(Number.isNaN(1e3)).toBe(false);
    expect(Number.isSafeInteger(1e1)).toBe(true);
    expect(Number.isSafeInteger(1e2)).toBe(true);
    expect(Number.isSafeInteger(1e3)).toBe(true);
    expect(Number.isFinite(1e1)).toBe(true);
    expect(Number.isFinite(1e2)).toBe(true);
    expect(Number.isFinite(1e3)).toBe(true);
    expect(Number('e1')).toBe(NaN);
    expect(Number('12e')).toBe(NaN);
  });
});

describe('소숫점(dot)', () => {
  test('0.0은 숫자로 인식한다', () => {
    expect(isNumber('0.0')).toBe(true);
  });
  test('0.1는 숫자로 인식한다', () => {
    expect(isNumber('0.1')).toBe(true);
  });
  test('0.10는 숫자로 인식한다', () => {
    expect(isNumber('0.10')).toBe(true);
  });
  test('1.0는 숫자로 인식한다', () => {
    expect(isNumber('1.0')).toBe(true);
  });
  test('.1는 숫자로 인식하지 못한다', () => {
    expect(isNumber('.1')).toBe(false);
  });
  test('1.는 숫자로 인식하지 못한다', () => {
    expect(isNumber('1.')).toBe(false);
  });
  test('0.1.1은 숫자로 인식하지 못한다', () => {
    expect(isNumber('0.1.1')).toBe(false);
  });

  test('javascript 내장 객체 소숫점 테스트', () => {
    expect(Number.isNaN(0.0)).toBe(false);
    expect(Number.isNaN(0.1)).toBe(false);
    expect(Number.isNaN(0.1)).toBe(false);
    expect(Number.isNaN(1.0)).toBe(false);
    expect(Number.isNaN(Number('.1'))).toBe(false);
    expect(Number.isNaN(Number('1.'))).toBe(false);
    expect(Number.isNaN(Number('0.1.1'))).toBe(true);
    expect(Number('.1')).toBe(0.1);
    expect(Number('1.')).toBe(1);
    expect(Number('0.1.1')).toBe(NaN);
  });
});

describe('구분자(comma)', () => {
  test('1,000은 숫자로 인식한다', () => {
    expect(isNumber('1,000')).toBe(true);
  });
  test('1,000,000은 숫자로 인식한다', () => {
    expect(isNumber('1,000,000')).toBe(true);
  });
  test('1,000,000,000은 숫자로 인식한다', () => {
    expect(isNumber('1,000,000,000')).toBe(true);
  });
  test('1,00은 숫자로 인식한다', () => {
    expect(isNumber('1,00')).toBe(true);
  });
  test('10,00은 숫자로 인식한다', () => {
    expect(isNumber('10,00')).toBe(true);
  });
  test('100,0은 숫자로 인식한다', () => {
    expect(isNumber('100,0')).toBe(true);
  });

  test('javascript 내장 객체 Number separtor 테스트', () => {
    expect(Number.isNaN(1_000)).toBe(false);
    expect(Number.isNaN(1_000_000)).toBe(false);
    expect(Number.isNaN(1_000_000_000)).toBe(false);
    expect(Number.isNaN(1_00)).toBe(false);
    expect(Number.isNaN(10_0)).toBe(false);
    expect(1_000).toBe(1000);
    expect(1_000_000).toBe(1000000);
    expect(1_000_000_000).toBe(1000000000);
    expect(1_00).toBe(100);
    expect(10_0).toBe(100);
    expect(100.0).toBe(100);
    expect(100.0_1).toBe(100.01);
  });
});

describe('연산자(operator)', () => {
  test('연산자가 포함되어 있지만 숫자로 인식하는 테스트', () => {
    expect(isNumber('+1')).toBe(true);
    expect(isNumber('-1')).toBe(true);
  });
  test('연산자가 포함되어 있지만 숫자로 인식하지 못하는 테스트', () => {
    expect(isNumber('+1+1')).toBe(false);
    expect(isNumber('-1+1')).toBe(false);
    expect(isNumber('1+1')).toBe(false);
    expect(isNumber('1-1')).toBe(false);
    expect(isNumber('*1')).toBe(false);
    expect(isNumber('/1')).toBe(false);
    expect(isNumber('^1')).toBe(false);
  });
  test('javascript 내장 객체 연산자 테스트', () => {
    expect(Number.isNaN(+1)).toBe(false);
    expect(Number.isNaN(-1)).toBe(false);
    expect(Number.isNaN(+1 + 1)).toBe(false);
    expect(Number.isNaN(-1 + 1)).toBe(false);
    expect(Number.isNaN(1 + 1)).toBe(false);
    expect(Number.isNaN(1 - 1)).toBe(false);
    expect(Number.isNaN(Number('+1 + 1'))).toBe(true);
    expect(Number.isNaN(Number('-1 + 1'))).toBe(true);
    expect(Number.isNaN(Number('1 + 1'))).toBe(true);
    expect(Number.isNaN(Number('1 - 1'))).toBe(true);
    expect(Number.isNaN(Number('*1'))).toBe(true);
    expect(Number.isNaN(Number('/1'))).toBe(true);
    expect(Number.isNaN(Number('^1'))).toBe(true);
    expect(Number('+1')).toBe(1);
    expect(Number('-1')).toBe(-1);
    expect(Number('+1 + 1')).toBe(NaN);
    expect(Number('-1 + 1')).toBe(NaN);
    expect(Number('1 + 1')).toBe(NaN);
    expect(Number('1 - 1')).toBe(NaN);
    expect(Number('*1')).toBe(NaN);
    expect(Number('/1')).toBe(NaN);
    expect(Number('^1')).toBe(NaN);
  });
});

describe('공백 문자(blank)', () => {
  test('공백 문자 혹은 빈 문자열은 숫자로 인식하지 못한다', () => {
    expect(isNumber('')).toBe(false);
    expect(isNumber(' ')).toBe(false);
  });

  test('javascript 내장 객체 공백 문자 테스트', () => {
    expect(Number.isNaN(Number(' '))).toBe(false);
    expect(Number.isNaN(Number(''))).toBe(false);
    expect(Number(' ')).toBe(0);
    expect(Number('')).toBe(0);
  });
});

describe('널(null)', () => {
  test('isNumber은 첫번째 매개변수를 null로 타입에러를 발생하기 때문에 입력할 수 없다', () => {});

  test('javascript 내장 객체 null 테스트', () => {
    expect(Number.isNaN(Number(null))).toBe(false);
    expect(Number(null)).toBe(0);
  });
});

describe('불리언(boolean)', () => {
  test('isNumber은 첫번째 매개변수를 boolean타입을 전달할 때 타입에러를 발생하기 때문에 입력할 수 없다', () => {});

  test('javascript 내장 객체 불리언 테스트', () => {
    expect(Number.isNaN(Number(true))).toBe(false);
    expect(Number.isNaN(Number(false))).toBe(false);
    expect(Number(true)).toBe(1);
    expect(Number(false)).toBe(0);
  });
});

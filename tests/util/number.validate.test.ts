import EXPRESSSIONS from '../../src/constants/expressions';

const isNumberMock = (value: string | number, opt?): boolean => {
  const regexpMatch = (num, opt) => {
    if (opt == null || opt === '1')
      return EXPRESSSIONS.DECIMAL_OPTIONAL_SIGN_COMMA_DOT_GLOBAL.test(num);
    if (opt === '2')
      return EXPRESSSIONS.DECIMAL_OPTIONAL_COMMA_DOT_GLOBAL.test(num);
    if (opt === '3') return EXPRESSSIONS.DECIMAL_OPTIONAL_DOT_GLOBAL.test(num);

    throw new Error(`Invalid option: ${opt}`);
  };

  const num = String(value)
    .replace(/(?:^\s+)|(?:\s+$)/g, '')
    .replace(',', '');
  const isNumberMatched = regexpMatch(num, opt);

  if (isNumberMatched === true) {
    return isNaN(Number(num.replace(/,/g, ''))) ? false : true;
  } else {
    return false;
  }
};

describe('숫자 유효성 검사 테스트', () => {
  test('123은 숫자로 인식한다', () => {
    const number = '123';

    const isValueMatchedNumberSuccess = isNumberMock(number);

    expect(isValueMatchedNumberSuccess).toBe(true);
  });

  test('isNumberMock 함수는 지수 표현 123e1을 숫자로 인식하지 못한다', () => {
    // 123e1 === 123 * 10
    const exponential = '123e1';

    const isValueMatchedNumberFailure = isNumberMock(exponential);
    const numberConcreateInstanceSuccess = Number.isInteger(
      Number(exponential),
    );

    expect(isValueMatchedNumberFailure).toBe(false);
    expect(numberConcreateInstanceSuccess).toBe(true);
  });

  test('123.456은 숫자로 인식한다', () => {
    const dottedNumber = '123.456';

    const isDottedNumberSuccess = isNumberMock(dottedNumber);

    expect(isDottedNumberSuccess).toBe(true);
  });

  test('123.456와 option === 3을 매개변수 인자로 넘겼을 때 숫자로 인식하지 못한다', () => {
    const finiteDecimal = '123.456';
    const decimalOption = '3';

    const isNumberFailure = isNumberMock(finiteDecimal, decimalOption);
    const isFiniteDecimalSuccess = Number.isFinite(Number(finiteDecimal));

    expect(isNumberFailure).toBe(false);
    expect(isFiniteDecimalSuccess).toBe(true);
  });

  test('공백 문자는 숫자로 인식하지 않는다', () => {
    const blank = ' ';

    const isBlankFailure = isNumberMock(blank);

    expect(isBlankFailure).toBe(false);
  });

  test('천 단위 콤마를 제외한 숫자는 숫자로 인식한다', () => {
    const comma = '1,234';

    const isCommaSuccess = isNumberMock(comma);

    expect(isCommaSuccess).toBe(true);
  });

  test('처음 혹은 마지막에 공백이 포함 된 정수를 표현하는 문자는 숫자로 인식한다', () => {
    const blankIncluded = ' 1234 ';

    const isBlankIncludedSuccess = isNumberMock(blankIncluded);

    expect(isBlankIncludedSuccess).toBe(true);
  });
});

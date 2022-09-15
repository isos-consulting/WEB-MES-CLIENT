import EXPRESSSIONS from '../../src/constants/expressions';

test('콤마가 포함된 문자열을 정규식을 이용해서 추출한 후 제거할 수 있다', () => {
  const str = 'qwe,zxcv,fdsgewt,qwe,t'.replace(EXPRESSSIONS.COMMA_GLOBAL, '');

  expect(str).toBe('qwezxcvfdsgewtqwet');
});

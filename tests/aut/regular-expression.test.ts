describe('정규식 테스트', () => {
  test('non-digit 정규식 [/[^0-9]/g, /D/g]은 같은 동작을 한다', () => {
    expect(/[^0-9]/g.test('a')).toBe(true);
    expect(/[^0-9]/g.test('1')).toBe(false);
    expect(/[^0-9]/g.test('1false')).toBe(true);
    expect(/[^0-9]/g.test('123e')).toBe(true);
    expect(/[^0-9]/g.test('123')).toBe(false);
    expect(/\D/g.test('a')).toBe(true);
    expect(/\D/g.test('1')).toBe(false);
    expect(/\D/g.test('true')).toBe(true);
    expect(/\D/g.test('false')).toBe(true);
    expect(/\D/g.test('1false')).toBe(true);
    expect(/\D/g.test('123e')).toBe(true);
    expect(/\D/g.test('123')).toBe(false);
  });
});

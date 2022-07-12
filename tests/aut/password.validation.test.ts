import PasswordValidation, {
  ValidationCounter,
} from '../../src/models/user/password';

test('카운터는 1씩  증가한다', () => {
  // given
  const counter = new ValidationCounter();
  const zero = counter.valueOf();

  // when
  counter.increment();
  const one = counter.valueOf();

  // then
  expect(zero).toBe(0);
  expect(one).toBe(1);
});

test('비밀번호 유효성 통과 개수가 2개 이상일 때 합격 처리 된다', () => {
  // given
  const validator = new PasswordValidation();
  const zeroInvalid = validator.isPassed();
  validator.pass();
  const oneInvalid = validator.isPassed();

  // when
  validator.pass();
  const twoValid = validator.isPassed();
  // then
  expect(zeroInvalid).toBe(false);
  expect(oneInvalid).toBe(false);
  expect(twoValid).toBe(true);
});

import UserLoginHistory, {
  LoginHistoryApiResponse,
} from '../../src/models/user/login-history';

test('사용자 접속 이력 클래스는 api 응답 객체로 변환 가능하다 ', () => {
  const loginHistory = {
    user_id: '1',
    user_nm: 'john',
    logged_at: '2020-01-01T00:00:00.000Z',
  };
  const userLoginHistory = new UserLoginHistory(loginHistory);

  const apiPResponse: LoginHistoryApiResponse = userLoginHistory.info();

  expect(apiPResponse).toEqual({
    user_id: '1',
    user_nm: 'john',
    logged_at: '2020-01-01T00:00:00.000Z',
  });
});

test('사용자 접속 이력서의 API 응답 객체 불변성을 띄고 있다', () => {
  const loginHistory = {
    user_id: '1',
    user_nm: 'john',
    logged_at: '2020-01-01T00:00:00.000Z',
  };
  const userLoginHistory = new UserLoginHistory(loginHistory);

  const apiPResponse: LoginHistoryApiResponse = userLoginHistory.info();

  expect(apiPResponse).not.toBe(loginHistory);
});

import UserLoginHistory, {
  LoginHistoryApiResponse,
} from '~/models/user/login-history';

test('사용자 접속 이력 클래스는 api 응답 객체로 변환 가능하다 ', () => {
  const loginHistory = {
    id: '1',
    user_nm: 'john',
    created_at: '2020-01-01T00:00:00.000Z',
  };

  const userLoginHistory = new UserLoginHistory(loginHistory);

  const apiPResponse: LoginHistoryApiResponse = userLoginHistory.info();

  expect(apiPResponse).toEqual({
    id: '1',
    user_nm: 'john',
    created_at: '2020-01-01T00:00:00.000Z',
  });
});

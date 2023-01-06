import UserManager, { CurrentUser } from '../../src/models/user/user';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.test' });
test('비밀번호 초기화 기능을 사용할 경우 사용자의 비밀번호가 변경 됨', () => {
  const kimOneToFour = new CurrentUser({
    id: 'kim',
    password: process.env.TEST_USER_PASSWORD,
  });
  const newPassword = '5678';

  const kimFiveToEight = kimOneToFour.resetPassword(newPassword);

  expect(kimOneToFour.password).toBe('1234');
  expect(kimFiveToEight.password).toBe('5678');
});

test('kim의 비밀번호를 변경해도 장표에 저장 된 kim의 비밀번호는 변경되지 않는다', () => {
  const userManager = new UserManager();
  const users = userManager.users();
  const kim = new CurrentUser({
    id: 'kim',
    password: process.env.TEST_USER_PASSWORD,
  });

  userManager.add(kim);
  const includesUsers = userManager.users();

  const kimFive = kim.resetPassword('5678');
  const includesUsersAfterReset = userManager.users();

  expect(users).toEqual([]);
  expect(includesUsers).toEqual([kim]);
  expect(includesUsersAfterReset).not.toEqual([kimFive]);
  expect(includesUsersAfterReset).toEqual([kim]);
});

import { test, expect } from '@playwright/test';

test('로그인이 정상적으로 완료되면 대시보드 페이지로 이동된다', async ({
  page,
}) => {
  // Go to http://191.1.70.232:3000/
  await page.goto('http://191.1.70.232:3000/');

  // Click body
  await page.locator('body').click();

  // Click text=-
  await page.locator('text=-').click();

  // Click text=본사-DEV
  await page.locator('text=본사-DEV').click();

  // Click [placeholder="아이디를 입력하세요\."]
  await page.locator('[placeholder="아이디를 입력하세요\\."]').click();

  // Fill [placeholder="아이디를 입력하세요\."]
  await page.locator('[placeholder="아이디를 입력하세요\\."]').fill('admin');

  // Press Tab
  await page.locator('[placeholder="아이디를 입력하세요\\."]').press('Tab');

  // Fill [placeholder="비밀번호를 입력하세요\."]
  await page.locator('[placeholder="비밀번호를 입력하세요\\."]').fill('123');

  // Click button:has-text("로그인")
  await page.locator('button:has-text("로그인")').click();
  await expect(page).toHaveURL('http://191.1.70.232:3000/dashboard');
});

test('공장을 선택하지 않고 로그인 시도시 "로그인 실패 : 공장을 선택해주세요."메시지가 나타난다', async ({
  page,
}) => {
  // Go to http://191.1.70.232:3000/
  await page.goto('http://191.1.70.232:3000/');

  // Click [placeholder="아이디를 입력하세요\."]
  await page.locator('[placeholder="아이디를 입력하세요\\."]').click();

  // Fill [placeholder="아이디를 입력하세요\."]
  await page.locator('[placeholder="아이디를 입력하세요\\."]').fill('admin');

  // Press Tab
  await page.locator('[placeholder="아이디를 입력하세요\\."]').press('Tab');

  // Fill [placeholder="비밀번호를 입력하세요\."]
  await page.locator('[placeholder="비밀번호를 입력하세요\\."]').fill('123');

  // Click button:has-text("로그인")
  await page.locator('button:has-text("로그인")').click();

  await expect(page.locator('.ant-message-notice-content')).toContainText(
    '로그인 실패 : 공장을 선택해주세요.',
  );
});

test('아이디를 입력하지 않고 로그인 시도시 "필수 항목을 입력하지 않았습니다." 메시지가 나타난다', async ({
  page,
}) => {
  // Go to http://191.1.70.232:3000/
  await page.goto('http://191.1.70.232:3000/');

  // Click text=-
  await page.locator('text=-').click();

  // Click text=본사-DEV
  await page.locator('text=본사-DEV').click();

  // Click [placeholder="비밀번호를 입력하세요\."]
  await page.locator('[placeholder="비밀번호를 입력하세요\\."]').click();

  // Fill [placeholder="비밀번호를 입력하세요\."]
  await page.locator('[placeholder="비밀번호를 입력하세요\\."]').fill('123');

  // Click button:has-text("로그인")
  await page.locator('button:has-text("로그인")').click();

  await expect(page.locator('.ant-message-notice-content')).toContainText(
    '필수 항목을 입력하지 않았습니다.',
  );
});

test('비밀번호를 입력하지 않고 로그인 시도 시 "[오류발생] 관리자에게 문의하세요." 메시지가 나타난다', async ({
  page,
}) => {
  // Go to http://191.1.70.232:3000/
  await page.goto('http://191.1.70.232:3000/');

  // Click text=-
  await page.locator('text=-').click();

  // Click text=본사-DEV
  await page.locator('text=본사-DEV').click();

  // Click [placeholder="아이디를 입력하세요\."]
  await page.locator('[placeholder="아이디를 입력하세요\\."]').click();

  // Fill [placeholder="아이디를 입력하세요\."]
  await page.locator('[placeholder="아이디를 입력하세요\\."]').fill('admin');

  // Click button:has-text("로그인")
  await page.locator('button:has-text("로그인")').click();

  await expect(page.locator('.ant-message-notice-content')).toContainText(
    '[오류발생] 관리자에게 문의하세요.',
  );
});

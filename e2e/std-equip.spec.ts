import { test, expect } from '@playwright/test';

test('설비관리화면에는 작업장 컬럼이 존재한다', async ({ page }) => {
  await page.goto('http://191.1.70.232:3000/');
  await page.locator('text=-').click();
  await page.locator('text=본사-DEV').click();
  await page.locator('[placeholder="아이디를 입력하세요\\."]').click();
  await page.locator('[placeholder="아이디를 입력하세요\\."]').fill('isos');
  await page.locator('[placeholder="아이디를 입력하세요\\."]').press('Tab');
  await page.locator('[placeholder="비밀번호를 입력하세요\\."]').fill('123');
  await page.locator('[placeholder="비밀번호를 입력하세요\\."]').press('Enter');
  await expect(page).toHaveURL('http://191.1.70.232:3000/dashboard');

  // Click text=기준정보
  // Click text=설비 관리 >> nth=0
  await page.locator('text=기준정보').click();
  await page.locator('div[role="menuitem"]:has-text("설비 정보")').click();
  await page.locator('text=설비 관리').first().click();
  await expect(page).toHaveURL('http://191.1.70.232:3000/std/equips');

  // Click button:has-text("조회")
  await page.locator('button:has-text("조회")').click();
  // Click text=작업장명
  await expect(page.locator('text=작업장명')).toHaveText('작업장명');

  // Click button:has-text("신규 항목 추가")
  await page.locator('button:has-text("신규 항목 추가")').click();
  await expect(
    page.locator('div[role="document"] >> text=작업장명'),
  ).toHaveText('작업장명');
  await page.locator('button:has-text("취소")').nth(1).click();

  // Click button:has-text("수정")
  await page.locator('button:has-text("수정")').click();
  await expect(
    page.locator('div[role="document"] >> text=작업장명'),
  ).toHaveText('작업장명');
  await page.locator('button:has-text("취소")').click();
});

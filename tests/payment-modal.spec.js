// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const osoznanieUrl = 'file://' + path.resolve(__dirname, '..', 'osoznanie.html');

const tariffs = [
  {
    buttonText: 'ОПЛАТИТЬ 1 ВЕБИНАР - $49',
    nth: 0,
    expectedTitle: 'Оплата: 1 вебинар (Часть 1)',
    expectedAmount: '$49',
    expectedComment: '«Осознание - 1 вебинар»',
  },
  {
    buttonText: 'ОПЛАТИТЬ 4 ВЕБИНАРА - $190',
    nth: 0,
    expectedTitle: 'Оплата: 4 вебинара (Часть 1)',
    expectedAmount: '$190',
    expectedComment: '«Осознание - 4 вебинара»',
  },
  {
    buttonText: 'ОПЛАТИТЬ 11 ВЕБИНАРОВ - $510',
    nth: 0,
    expectedTitle: 'Оплата: Все 11 вебинаров (Часть 1)',
    expectedAmount: '$510',
    expectedComment: '«Осознание - Часть 1 (11 вебинаров)»',
  },
  {
    buttonText: 'ОПЛАТИТЬ 1 ВЕБИНАР - $49',
    nth: 1,
    expectedTitle: 'Оплата: 1 вебинар (Часть 2)',
    expectedAmount: '$49',
    expectedComment: '«Осознание Часть 2 - 1 вебинар»',
  },
  {
    buttonText: 'ОПЛАТИТЬ 4 ВЕБИНАРА - $190',
    nth: 1,
    expectedTitle: 'Оплата: 4 вебинара (Часть 2)',
    expectedAmount: '$190',
    expectedComment: '«Осознание Часть 2 - 4 вебинара»',
  },
  {
    buttonText: 'ОПЛАТИТЬ 12 ВЕБИНАРОВ - $510',
    nth: 0,
    expectedTitle: 'Оплата: Все 12 вебинаров (Часть 2)',
    expectedAmount: '$510',
    expectedComment: '«Осознание - Часть 2 (12 вебинаров)»',
  },
];

test.describe('Модалка оплаты osoznanie.html', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(osoznanieUrl);
  });

  for (const tariff of tariffs) {
    test(`показывает корректные данные: ${tariff.expectedTitle}`, async ({ page }) => {
      const modal = page.locator('#paymentModal');
      await expect(modal).not.toHaveClass(/active/);

      await page.getByRole('button', { name: tariff.buttonText }).nth(tariff.nth).click();

      await expect(modal).toHaveClass(/active/);
      await expect(page.locator('#modalTitle')).toHaveText(tariff.expectedTitle);
      await expect(page.locator('#modalAmount')).toHaveText(tariff.expectedAmount);
      await expect(page.locator('#modalComment')).toHaveText(tariff.expectedComment);
    });
  }

  test('закрывается по Escape', async ({ page }) => {
    const modal = page.locator('#paymentModal');
    await page.getByRole('button', { name: 'ОПЛАТИТЬ 1 ВЕБИНАР - $49' }).first().click();
    await expect(modal).toHaveClass(/active/);

    await page.keyboard.press('Escape');
    await expect(modal).not.toHaveClass(/active/);
  });

  test('закрывается по клику на оверлей', async ({ page }) => {
    const modal = page.locator('#paymentModal');
    await page.getByRole('button', { name: 'ОПЛАТИТЬ 1 ВЕБИНАР - $49' }).first().click();
    await expect(modal).toHaveClass(/active/);

    await modal.click({ position: { x: 5, y: 5 } });
    await expect(modal).not.toHaveClass(/active/);
  });

  test('закрывается по кнопке «×»', async ({ page }) => {
    const modal = page.locator('#paymentModal');
    await page.getByRole('button', { name: 'ОПЛАТИТЬ 1 ВЕБИНАР - $49' }).first().click();
    await expect(modal).toHaveClass(/active/);

    await page.locator('.modal-close').click();
    await expect(modal).not.toHaveClass(/active/);
  });
});

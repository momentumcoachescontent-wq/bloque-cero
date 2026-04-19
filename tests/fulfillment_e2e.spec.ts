import { test, expect } from "@playwright/test";

test.describe("Fulfillment E2E Flow — Bloque Cero", () => {
  test("Debería completar el diagnóstico para la vertical de Salud/Psicología", async ({ page }) => {
    // 1. Navegación al diagnóstico
    await page.goto("/diagnostic");
    await expect(page).toHaveTitle(/Diagnóstico/i);

    // PASO 1: Contacto
    await page.fill("#diag-name", "Test Doctor");
    await page.fill("#diag-email", "doctor@test.com");
    await page.fill("#diag-whatsapp", "5212345678");
    await page.click("#diag-next");

    // PASO 2: Tu negocio
    await page.fill("#diag-business-name", "Clinica Integral");
    await page.fill("#diag-business-idea", "Servicios de salud mental escalables con IA");
    await page.click("#type-psicologia_salud");
    await page.click("#audience-b2c");
    await page.click("#diag-next");

    // PASO 3: Tu mercado
    await page.selectOption("#diag-country", "MX");
    await page.click("#ticket-medio");
    await page.click("#channel-digital");
    await page.click("#diag-next");

    // PASO 4: Operación
    await page.click("#logistics-no");
    await page.click("#payments-si");
    await page.click("#diag-next");

    // PASO 5: Tu momento
    await page.click("#etapa-idea");
    await page.click("#dolor-agotamiento_1_1");
    await page.click("#diag-next");

    // PASO 6: Tu tiempo
    await page.click("#tiempo-meses");
    
    // FINALIZAR
    await page.click("#diag-next");

    // Verificación de resultado (Score, Veredicto)
    await expect(page.locator("p:has-text('Score de Viabilidad')")).toBeVisible();
    await expect(page.locator("text=Agotamiento 1-1")).toBeVisible();
  });
});

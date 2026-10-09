import { test, expect } from '@playwright/test';

test.describe('CropCare AI — Full Agricultural Workflow Tests', () => {

  test('Flow 1: Home page loads with clean agricultural UX and 3 prominent input modes', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/CropCare AI/);

    // Check emergency hotline badge
    await expect(page.locator('text=1800-180-1551')).toBeVisible();

    // Check 3 input tabs
    await expect(page.locator('text=Upload Crop Photo')).toBeVisible();
    await expect(page.locator('text=Describe Symptoms')).toBeVisible();
    await expect(page.locator('text=Speak Symptoms')).toBeVisible();
  });

  test('Flow 2: Switch between English, Telugu, and Hindi seamlessly across UI', async ({ page }) => {
    await page.goto('/');

    // Switch to Telugu (తెలుగు)
    await page.click('button:has-text("తెలుగు")');
    await expect(page.locator('text=మీ పంట తెగులును క్షణాల్లో గుర్తించండి')).toBeVisible();
    await expect(page.locator('text=పంట ఫోటో అప్‌లోడ్')).toBeVisible();

    // Switch to Hindi (हिन्दी)
    await page.click('button:has-text("हिन्दी")');
    await expect(page.locator('text=अपनी फसल के रोग को कुछ ही सेकंड में पहचानें')).toBeVisible();
    await expect(page.locator('text=फसल फोटो अपलोड करें')).toBeVisible();

    // Switch back to English
    await page.click('button:has-text("English")');
    await expect(page.locator('text=Diagnose Your Crop Health in Seconds')).toBeVisible();
  });

  test('Flow 3: Natural language symptom input produces evidence-based assessment and dosage calculation', async ({ page }) => {
    await page.goto('/');

    // Select "Describe Symptoms" tab
    await page.click('text=Describe Symptoms');

    // Type symptoms
    const textarea = page.locator('textarea');
    await textarea.fill('Chilli plants have curled leaves with tiny whiteflies underneath');

    // Submit analysis
    await page.click('button:has-text("Analyze Crop Health")');

    // Result screen should load
    await expect(page).toHaveURL(/.*\/diagnose\/result/);
    await expect(page.locator('text=Chilli')).toBeVisible();
    await expect(page.locator('text=Chilli Leaf Curl')).toBeVisible();

    // Check dosage calculator on result screen
    await expect(page.locator('text=Interactive Dosage & Spray Calculator')).toBeVisible();
    await expect(page.locator('text=Recommended Product Quantity')).toBeVisible();
  });

  test('Flow 4: Weather & Agricultural Advisories page displays live parameters & risk indices', async ({ page }) => {
    await page.goto('/weather');
    await expect(page.locator('text=Local Weather & Agricultural Risk Advisory')).toBeVisible();
    await expect(page.locator('text=Relative Humidity')).toBeVisible();
    await expect(page.locator('text=Pesticide / Foliar Spray Condition')).toBeVisible();
    await expect(page.locator('text=Regional Agricultural Advisory Bulletin')).toBeVisible();
  });

  test('Flow 5: Treatments & Prevention page allows interactive CIBRC dosage calculation', async ({ page }) => {
    await page.goto('/treatments');
    await expect(page.locator('text=Treatments & Dosing')).toBeVisible();
    await expect(page.locator('text=Rice Blast')).toBeVisible();

    // Check calculator
    const areaInput = page.locator('input[type="number"]');
    await areaInput.fill('2.5');
    await expect(page.locator('text=Recommended Product Quantity')).toBeVisible();
  });

  test('Flow 6: Farmer Health Guide & Emergency Contacts page renders toxicity triangles and helplines', async ({ page }) => {
    await page.goto('/education');
    await expect(page.locator('text=Farmer Crop Health Guide')).toBeVisible();
    await expect(page.locator('text=Understanding Toxicity Triangle Labels')).toBeVisible();
    await expect(page.locator('text=Kisan Call Center (Ministry of Agriculture, GoI)')).toBeVisible();
    await expect(page.locator('text=1800-180-1551')).toBeVisible();
  });

  test('Flow 7: Admin Portal is protected by secret key authorization', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('text=Admin Secret Key / Password')).toBeVisible();

    // Enter admin key
    await page.fill('input[type="password"]', 'cropcare_admin_secret_dev_2026');
    await page.click('button:has-text("Verify & Enter Portal")');

    // Admin dashboard should open
    await expect(page.locator('text=Verified Disease & Label Records')).toBeVisible();
    await expect(page.locator('text=Farmer Feedback')).toBeVisible();
  });

  test('Flow 8: Privacy & Data Consent page allows toggling consent and clearing local data', async ({ page }) => {
    await page.goto('/settings/privacy');
    await expect(page.locator('text=Farmer Data Consent Controls')).toBeVisible();
    await expect(page.locator('text=Clear All My Local Data')).toBeVisible();
  });
});

import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:5176'
const SHOTS = './screenshots'
mkdirSync(SHOTS, { recursive: true })

const browser = await chromium.launch({ headless: true })
const page    = await browser.newPage()

// Rozmiar jak telefon (portrait)
await page.setViewportSize({ width: 390, height: 844 })

// 1. Ekran główny
await page.goto(BASE)
await page.waitForTimeout(1000)
await page.screenshot({ path: `${SHOTS}/01_main.png`, fullPage: true })
console.log('📸 01 — ekran główny')

// 2. Kliknij Gry → LiterMistrz Phaser
await page.click('button:has-text("Gry")')
await page.waitForTimeout(2500)
await page.screenshot({ path: `${SHOTS}/02_litermistrz_menu.png`, fullPage: true })
console.log('📸 02 — menu LiterMistrz')

// 3. Kliknij GRAJ — przez współrzędne canvasu (Phaser)
const canvas = page.locator('canvas').first()
const box    = await canvas.boundingBox()

if (box) {
  // Przycisk GRAJ jest na ok. 75% wysokości canvasu, środek szerokości
  await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.75)
  await page.waitForTimeout(2500)
  await page.screenshot({ path: `${SHOTS}/03_gra.png`, fullPage: true })
  console.log('📸 03 — ekran gry (pytanie)')

  // 4. Pierwsza odpowiedź — lewy górny przycisk (ok. 28% x, 52% y)
  await page.mouse.click(box.x + box.width * 0.28, box.y + box.height * 0.52)
  await page.waitForTimeout(1800)
  await page.screenshot({ path: `${SHOTS}/04_odpowiedz.png`, fullPage: true })
  console.log('📸 04 — po odpowiedzi')

  // Zagraj pozostałe 9 rund
  const clicks = [
    [0.72, 0.52], [0.28, 0.70], [0.72, 0.70],
    [0.28, 0.52], [0.72, 0.52], [0.28, 0.70],
    [0.72, 0.70], [0.28, 0.52], [0.72, 0.52],
  ]
  for (const [xOff, yOff] of clicks) {
    await page.waitForTimeout(2400)
    await page.mouse.click(box.x + box.width * xOff, box.y + box.height * yOff)
  }

  await page.waitForTimeout(3500)
  await page.screenshot({ path: `${SHOTS}/05_wyniki.png`, fullPage: true })
  console.log('📸 05 — ekran wyników')
}

await browser.close()
console.log('\n✅ Gotowe! Screenshoty w ./screenshots/')

import { defineConfig } from '@playwright/test'

// BASE_URL aponta os testes para o site publicado; sem ele, usa o build local.
const remote = process.env.BASE_URL

export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e/.results',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: remote ?? 'http://localhost:4173', locale: 'pt-BR', timezoneId: 'America/Sao_Paulo' },
  projects: [
    { name: 'celular-360', use: { viewport: { width: 360, height: 800 }, hasTouch: true } },
    { name: 'desktop-1280', use: { viewport: { width: 1280, height: 800 } } },
  ],
  // O teste usa o site já montado por `vite build`.
  webServer: remote
    ? undefined
    : {
        command: 'npx vite preview --port 4173 --strictPort',
        url: 'http://localhost:4173',
        reuseExistingServer: true,
      },
})

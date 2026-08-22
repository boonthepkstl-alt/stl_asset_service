import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
    // Roadmap-only pages (Licenses, AI Decision Center) are gated off by default in real
    // builds (see src/config/featureFlags.ts) but the existing test suite predates that gate
    // and asserts these pages are reachable -- keep the flag on for the default test run so
    // that intent still holds. src/App.roadmap-gating.test.tsx stubs it off explicitly to
    // verify the gate itself.
    env: {
      VITE_ENABLE_ROADMAP_FEATURES: 'true',
    },
  },
});

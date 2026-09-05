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
    // Open Finding F-44 (2026-09-05). Vitest 2's default pool is `forks`, and the forked
    // child cannot share the parent's module cache, so it round-trips every transformed
    // module through a file under os.tmpdir() (`cacheFs: true`, set only on the
    // child-process channel). On Windows two workers race that write and one loses with
    // EBUSY, which drops whole test FILES from collection -- observed 49/244 instead of
    // 50/257. The run does exit 1 and print "Unhandled Errors", so it fails loudly rather
    // than passing silently; the hazard is a reader taking the "Tests N passed" line at
    // face value and recording a short count in a checkpoint.
    //
    // `threads` shares memory, so it never touches that temp path. Measured on this suite:
    // threads 50/257 on 3 of 3 runs at ~12s; forks 50/257 on only 3 of 4, the failure at
    // ~12s too -- so this costs no speed. Revisit only if a test needs process isolation
    // (a native module, or per-file process env), which nothing here does today.
    pool: 'threads',
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

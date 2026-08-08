import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["cjs"],
  target: "node18",
  outDir: "dist",
  clean: true,
  bundle: true,
  splitting: false,
  sourcemap: true,
  minify: false,
  // Keep Prisma/pg outside the bundle; everything else is inlined for Vercel
  external: [
    "@prisma/client",
    ".prisma/client",
    "@prisma/adapter-pg",
    "pg",
  ],
  // @vercel/node expects module.exports = app (not { default: app })
  footer: {
    js: "module.exports = module.exports.default || module.exports;",
  },
});

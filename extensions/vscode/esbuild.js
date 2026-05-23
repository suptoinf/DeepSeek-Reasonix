// @ts-check
const esbuild = require("esbuild");

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");

/**
 * @type {import('esbuild').BuildOptions}
 */
const config = {
  entryPoints: ["src/extension.ts"],
  bundle: true,
  outdir: "dist",
  external: ["vscode"],
  format: "cjs",
  platform: "node",
  target: "node20",
  sourcemap: production ? false : true,
  minify: production,
  keepNames: true,
};

async function main() {
  if (watch) {
    const ctx = await esbuild.context(config);
    await ctx.watch();
    console.log("[watch] watching for changes...");
  } else {
    const result = await esbuild.build(config);
    if (result.errors.length > 0) {
      process.exit(1);
    }
    console.log("[build] done");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

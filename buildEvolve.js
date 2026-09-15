const esbuild = require("esbuild");

Promise.all([
  esbuild.build({
    logLevel: "info",
    entryPoints: ["./src/main.js"],
    bundle: true,
    minify: true,
    outfile: "evolve/main.js",
  }),
  esbuild.build({
    logLevel: "info",
    entryPoints: ["./src/chronicles/ui/app.js"],
    bundle: true,
    minify: true,
    define: { __CHRONICLES_DEV__: "false" },
    outfile: "evolve/chronicles.js",
  }),
])
  .catch(() => process.exit(1));

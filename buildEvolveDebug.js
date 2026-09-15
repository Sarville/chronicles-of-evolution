const esbuild = require("esbuild");

Promise.all([
  esbuild.build({
    logLevel: "debug",
    entryPoints: ["./src/main.js"],
    bundle: true,
    minify: false,
    sourcemap : true,
    outfile: "evolve/main.js",
  }),
  esbuild.build({
    logLevel: "debug",
    entryPoints: ["./src/chronicles/ui/app.js"],
    bundle: true,
    minify: false,
    sourcemap: true,
    define: { __CHRONICLES_DEV__: "true" },
    outfile: "evolve/chronicles.js",
  }),
])
  .catch(() => process.exit(1));

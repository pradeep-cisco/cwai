// Run after `pnpm build` to refresh the downloadable reference from the UI.
import fs from "node:fs"
import path from "node:path"
import os from "node:os"
import { createRequire } from "node:module"
import { execFileSync } from "node:child_process"
import ts from "typescript"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"

const require = createRequire(import.meta.url)
const source = fs.readFileSync("src/DecisionFlowchart.tsx", "utf8")
  .replaceAll("import.meta.env.BASE_URL", '"/"')
const compiled = ts.transpileModule(source, {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS },
}).outputText
const module = { exports: {} }
new Function("require", "module", "exports", compiled)(require, module, module.exports)
const markup = renderToStaticMarkup(React.createElement(module.exports.default))
const css = fs.readdirSync("dist/assets")
  .filter((name) => name.endsWith(".css"))
  .map((name) => fs.readFileSync(path.join("dist/assets", name), "utf8"))
  .join("\n")
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "crosswork-pdf-"))
const output = path.resolve("public/downloads/crosswork-ai-decision-tree.pdf")
fs.mkdirSync(path.dirname(output), { recursive: true })
try {
  fs.writeFileSync(path.join(temp, "reference.html"), `<!doctype html>
<html><head><meta charset="utf-8"><title>Crosswork AI — Decision Tree</title>
<style>${css}
html, body { margin: 0; background: #080f19; color: #e2e8f0; }
body { width: max-content; padding: 40px; font-family: Arial, sans-serif; }
a[download] { display: none; }
* { animation: none !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
</style></head><body>${markup}
<script>
const style = document.createElement("style");
style.textContent = "@page { size: " + Math.ceil(document.documentElement.scrollWidth) + "px " + (Math.ceil(document.documentElement.scrollHeight) + 160) + "px; margin: 0; }";
document.head.appendChild(style);
</script></body></html>`)
  execFileSync("chromium", [
    "--headless", "--no-sandbox", "--disable-gpu",
    `--user-data-dir=${path.join(temp, "profile")}`,
    "--no-pdf-header-footer", `--print-to-pdf=${output}`,
    `file://${path.join(temp, "reference.html")}`,
  ], { stdio: "pipe", timeout: 60000 })
  console.log(`Exported ${output}`)
} finally {
  fs.rmSync(temp, { recursive: true, force: true })
}

import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import ts from "typescript";

// Run the actual TypeScript module in Node tests. Server-only framework imports
// can be replaced explicitly; production functions are never copied into tests.
export function importSource(relativePath, mocks = {}) {
  const cache = new Map();
  function load(filename) {
    const absolute = path.resolve(filename);
    if (cache.has(absolute)) return cache.get(absolute).exports;
    const loadedModule = { exports: {} };
    cache.set(absolute, loadedModule);
    const nativeRequire = createRequire(absolute);
    const sourceRequire = id => {
      if (Object.hasOwn(mocks, id)) return mocks[id];
      if (id.startsWith("@/") || id.startsWith(".")) {
        const base = id.startsWith("@/") ? path.resolve("src", id.slice(2)) : path.resolve(path.dirname(absolute), id);
        const resolved = [base, `${base}.ts`, `${base}.tsx`].find(file => existsSync(file) && /\.tsx?$/.test(file));
        if (resolved) return load(resolved);
      }
      return nativeRequire(id);
    };
    const { outputText } = ts.transpileModule(readFileSync(absolute, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
      fileName: absolute,
    });
    new Function("require", "module", "exports", outputText)(sourceRequire, loadedModule, loadedModule.exports);
    return loadedModule.exports;
  }
  return load(relativePath);
}

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// _worker.js/index.js
import { renderers } from "./renderers.mjs";
import { createExports } from "./_@astrojs-ssr-adapter.mjs";
import { manifest } from "./manifest_CIiFKicO.mjs";
globalThis.process ??= {};
globalThis.process.env ??= {};
var _page0 = /* @__PURE__ */ __name(() => import("./pages/_actions/_---path_.astro.mjs"), "_page0");
var _page1 = /* @__PURE__ */ __name(() => import("./pages/_image.astro.mjs"), "_page1");
var _page2 = /* @__PURE__ */ __name(() => import("./pages/about.astro.mjs"), "_page2");
var _page3 = /* @__PURE__ */ __name(() => import("./pages/api/revalidate.astro.mjs"), "_page3");
var _page4 = /* @__PURE__ */ __name(() => import("./pages/contact.astro.mjs"), "_page4");
var _page5 = /* @__PURE__ */ __name(() => import("./pages/treks/_slug_.astro.mjs"), "_page5");
var _page6 = /* @__PURE__ */ __name(() => import("./pages/treks.astro.mjs"), "_page6");
var _page7 = /* @__PURE__ */ __name(() => import("./pages/index.astro.mjs"), "_page7");
var pageMap = /* @__PURE__ */ new Map([
  ["../../node_modules/astro/dist/actions/runtime/route.js", _page0],
  ["../../node_modules/astro/dist/assets/endpoint/generic.js", _page1],
  ["src/pages/about.astro", _page2],
  ["src/pages/api/revalidate.ts", _page3],
  ["src/pages/contact.astro", _page4],
  ["src/pages/treks/[slug].astro", _page5],
  ["src/pages/treks/index.astro", _page6],
  ["src/pages/index.astro", _page7]
]);
var serverIslandMap = /* @__PURE__ */ new Map();
var _manifest = Object.assign(manifest, {
  pageMap,
  serverIslandMap,
  renderers,
  middleware: () => import("./_astro-internal_middleware.mjs")
});
var _exports = createExports(_manifest);
var __astrojsSsrVirtualEntry = _exports.default;
export {
  __astrojsSsrVirtualEntry as default,
  pageMap
};
//# sourceMappingURL=bundledWorker-0.26883284354025094.mjs.map

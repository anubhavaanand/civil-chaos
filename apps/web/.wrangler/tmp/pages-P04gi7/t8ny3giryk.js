// <define:__ROUTES__>
var define_ROUTES_default = {
  version: 1,
  include: [
    "/*"
  ],
  exclude: [
    "/",
    "/_astro/*",
    "/draco/*",
    "/favicon.ico",
    "/favicon.svg",
    "/images/*",
    "/models/*",
    "/robots.txt",
    "/api/*",
    "/contact",
    "/about",
    "/treks/*"
  ]
};

// node_modules/wrangler/templates/pages-dev-pipeline.ts
import worker from "/home/anubhavanand/Documents/civil-chaos/civil-chaos/apps/web/.wrangler/tmp/pages-P04gi7/bundledWorker-0.26883284354025094.mjs";
import { isRoutingRuleMatch } from "/home/anubhavanand/Documents/civil-chaos/civil-chaos/apps/web/node_modules/wrangler/templates/pages-dev-util.ts";
export * from "/home/anubhavanand/Documents/civil-chaos/civil-chaos/apps/web/.wrangler/tmp/pages-P04gi7/bundledWorker-0.26883284354025094.mjs";
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        const workerAsHandler = worker;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  pages_dev_pipeline_default as default
};
//# sourceMappingURL=t8ny3giryk.js.map

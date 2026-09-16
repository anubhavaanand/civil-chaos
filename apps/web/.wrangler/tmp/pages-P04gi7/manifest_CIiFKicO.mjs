globalThis.process ??= {}; globalThis.process.env ??= {};
import { d as decodeKey } from './chunks/astro/server_Dud8S12r.mjs';
import './chunks/shared_BnCbmBJD.mjs';
import './chunks/astro-designed-error-pages_Cw40yXNO.mjs';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_DodeThgm.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///home/anubhavanand/Documents/civil-chaos/civil-chaos/apps/web/","adapterName":"@astrojs/cloudflare","routes":[{"file":"about/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"api/revalidate","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/revalidate","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/revalidate\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"revalidate","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/revalidate.ts","pathname":"/api/revalidate","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"contact/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/contact","isIndex":false,"type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"treks/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/treks","isIndex":true,"type":"page","pattern":"^\\/treks\\/?$","segments":[[{"content":"treks","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/treks/index.astro","pathname":"/treks","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_actions/[...path]","pattern":"^\\/_actions(?:\\/(.*?))?$","segments":[[{"content":"_actions","dynamic":false,"spread":false}],[{"content":"...path","dynamic":true,"spread":true}]],"params":["...path"],"component":"../../node_modules/astro/dist/actions/runtime/route.js","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"../../node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"site":"https://dreamoftheholyhimalayas.com","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/home/anubhavanand/Documents/civil-chaos/civil-chaos/apps/web/src/pages/about.astro",{"propagation":"in-tree","containsHead":true}],["/home/anubhavanand/Documents/civil-chaos/civil-chaos/apps/web/src/pages/contact.astro",{"propagation":"in-tree","containsHead":true}],["/home/anubhavanand/Documents/civil-chaos/civil-chaos/apps/web/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["/home/anubhavanand/Documents/civil-chaos/civil-chaos/apps/web/src/pages/treks/[slug].astro",{"propagation":"in-tree","containsHead":true}],["/home/anubhavanand/Documents/civil-chaos/civil-chaos/apps/web/src/pages/treks/index.astro",{"propagation":"in-tree","containsHead":true}],["/home/anubhavanand/Documents/civil-chaos/civil-chaos/apps/web/src/components/GlassNav.astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/about@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/contact@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/treks/[slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/treks/index@_@astro",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"index.js","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:../../node_modules/astro/dist/actions/runtime/route@_@js":"pages/_actions/_---path_.astro.mjs","\u0000@astro-page:src/pages/api/revalidate@_@ts":"pages/api/revalidate.astro.mjs","\u0000@astro-page:src/pages/contact@_@astro":"pages/contact.astro.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000@astro-page:src/pages/treks/index@_@astro":"pages/treks.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-page:src/pages/treks/[slug]@_@astro":"pages/treks/_slug_.astro.mjs","\u0000@astro-page:../../node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","/home/anubhavanand/Documents/civil-chaos/civil-chaos/node_modules/astro/dist/actions/runtime/virtual/get-action.js":"chunks/get-action_DCLcjaxO.mjs","/home/anubhavanand/Documents/civil-chaos/civil-chaos/apps/web/node_modules/@astrojs/cloudflare/dist/entrypoints/image-service.js":"chunks/image-service_q4Ampmgv.mjs","\u0000@astrojs-manifest":"manifest_CIiFKicO.mjs","\u0000astro:internal-actions":"chunks/_astro_internal-actions_Bc-0wTFz.mjs","/astro/hoisted.js?q=1":"_astro/hoisted.CqQc4DB-.js","/astro/hoisted.js?q=2":"_astro/hoisted.kwRlgv-V.js","/home/anubhavanand/Documents/civil-chaos/civil-chaos/node_modules/three/examples/jsm/loaders/DRACOLoader.js":"_astro/DRACOLoader.DR38iCMV.js","/home/anubhavanand/Documents/civil-chaos/civil-chaos/node_modules/maplibre-gl/dist/maplibre-gl.css":"_astro/maplibre-gl.BE728Bt1.js","/home/anubhavanand/Documents/civil-chaos/civil-chaos/node_modules/three/examples/jsm/loaders/GLTFLoader.js":"_astro/GLTFLoader.GDEd87Oj.js","/home/anubhavanand/Documents/civil-chaos/civil-chaos/node_modules/three/build/three.module.js":"_astro/three.module.BO1AaQqQ.js","/home/anubhavanand/Documents/civil-chaos/civil-chaos/node_modules/maplibre-gl/dist/maplibre-gl.mjs":"_astro/maplibre-gl.BPYWNGeR.js","/astro/hoisted.js?q=0":"_astro/hoisted.BNAfyA8E.js","/astro/hoisted.js?q=3":"_astro/hoisted.BScVxmeO.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/inter-cyrillic-ext-400-normal.BQZuk6qB.woff2","/_astro/space-grotesk-latin-ext-400-normal.CfP_5XZW.woff2","/_astro/space-grotesk-latin-400-normal.CJ-V5oYT.woff2","/_astro/space-grotesk-vietnamese-400-normal.B7xT_GF5.woff2","/_astro/inter-cyrillic-400-normal.obahsSVq.woff2","/_astro/inter-greek-ext-400-normal.DGGRlc-M.woff2","/_astro/inter-vietnamese-400-normal.DMkecbls.woff2","/_astro/inter-greek-400-normal.B4URO6DV.woff2","/_astro/inter-latin-400-normal.C38fXH4l.woff2","/_astro/inter-latin-ext-400-normal.C1nco2VV.woff2","/_astro/space-grotesk-latin-ext-400-normal.DRPE3kg4.woff","/_astro/inter-cyrillic-ext-400-normal.DQukG94-.woff","/_astro/space-grotesk-latin-400-normal.BnQMeOim.woff","/_astro/space-grotesk-vietnamese-400-normal.BIWiOVfw.woff","/_astro/inter-vietnamese-400-normal.Bbgyi5SW.woff","/_astro/inter-greek-ext-400-normal.KugGGMne.woff","/_astro/inter-latin-400-normal.CyCys3Eg.woff","/_astro/inter-cyrillic-400-normal.HOLc17fK.woff","/_astro/inter-latin-ext-400-normal.77YHD8bZ.woff","/_astro/inter-greek-400-normal.q2sYcFCs.woff","/_astro/about.B83w77QW.css","/favicon.ico","/favicon.svg","/robots.txt","/_astro/DRACOLoader.DR38iCMV.js","/_astro/GLTFLoader.GDEd87Oj.js","/_astro/hoisted.BNAfyA8E.js","/_astro/hoisted.BScVxmeO.js","/_astro/hoisted.CqQc4DB-.js","/_astro/hoisted.kwRlgv-V.js","/_astro/maplibre-gl.9UNWPgFo.css","/_astro/maplibre-gl.BPYWNGeR.js","/_astro/three.module.BO1AaQqQ.js","/_worker.js/_@astrojs-ssr-adapter.mjs","/_worker.js/_astro-internal_middleware.mjs","/_worker.js/index.js","/_worker.js/renderers.mjs","/draco/draco_decoder.js","/draco/draco_decoder.wasm","/draco/draco_encoder.js","/draco/draco_wasm_wrapper.js","/models/rugged_mountain_landscape.glb","/models/rugged_mountain_landscape_draco.glb","/models/weisse_wand_mountain_peek.glb","/models/weisse_wand_mountain_peek_draco.glb","/_worker.js/_astro/about.B83w77QW.css","/_worker.js/_astro/inter-cyrillic-400-normal.HOLc17fK.woff","/_worker.js/_astro/inter-cyrillic-400-normal.obahsSVq.woff2","/_worker.js/_astro/inter-cyrillic-ext-400-normal.BQZuk6qB.woff2","/_worker.js/_astro/inter-cyrillic-ext-400-normal.DQukG94-.woff","/_worker.js/_astro/inter-greek-400-normal.B4URO6DV.woff2","/_worker.js/_astro/inter-greek-400-normal.q2sYcFCs.woff","/_worker.js/_astro/inter-greek-ext-400-normal.DGGRlc-M.woff2","/_worker.js/_astro/inter-greek-ext-400-normal.KugGGMne.woff","/_worker.js/_astro/inter-latin-400-normal.C38fXH4l.woff2","/_worker.js/_astro/inter-latin-400-normal.CyCys3Eg.woff","/_worker.js/_astro/inter-latin-ext-400-normal.77YHD8bZ.woff","/_worker.js/_astro/inter-latin-ext-400-normal.C1nco2VV.woff2","/_worker.js/_astro/inter-vietnamese-400-normal.Bbgyi5SW.woff","/_worker.js/_astro/inter-vietnamese-400-normal.DMkecbls.woff2","/_worker.js/_astro/space-grotesk-latin-400-normal.BnQMeOim.woff","/_worker.js/_astro/space-grotesk-latin-400-normal.CJ-V5oYT.woff2","/_worker.js/_astro/space-grotesk-latin-ext-400-normal.CfP_5XZW.woff2","/_worker.js/_astro/space-grotesk-latin-ext-400-normal.DRPE3kg4.woff","/_worker.js/_astro/space-grotesk-vietnamese-400-normal.B7xT_GF5.woff2","/_worker.js/_astro/space-grotesk-vietnamese-400-normal.BIWiOVfw.woff","/_worker.js/chunks/Footer_CkMS4YQe.mjs","/_worker.js/chunks/_astro_actions_DLfokQPC.mjs","/_worker.js/chunks/_astro_internal-actions_Bc-0wTFz.mjs","/_worker.js/chunks/astro-designed-error-pages_Cw40yXNO.mjs","/_worker.js/chunks/astro_Dbf5nYjU.mjs","/_worker.js/chunks/get-action_DCLcjaxO.mjs","/_worker.js/chunks/image-service_q4Ampmgv.mjs","/_worker.js/chunks/noop-middleware_DodeThgm.mjs","/_worker.js/chunks/render-context_C4Kp2lmh.mjs","/_worker.js/chunks/shared_BnCbmBJD.mjs","/_worker.js/chunks/site_CWrdBkCD.mjs","/_worker.js/chunks/strapi_BJXxpQpC.mjs","/_worker.js/chunks/utils_C9aeIuEK.mjs","/_worker.js/pages/_image.astro.mjs","/_worker.js/pages/about.astro.mjs","/_worker.js/pages/contact.astro.mjs","/_worker.js/pages/index.astro.mjs","/_worker.js/pages/treks.astro.mjs","/images/social/476207379_917289117267562_1267857918377037637_n.jpg","/images/social/476910428_918821497114324_2001678939768958977_n.jpg","/images/social/477156761_918821477114326_1286729344156312226_n.jpg","/images/social/480433774_926157863047354_3463759633390195251_n.jpg","/images/social/480460195_926155569714250_8291341533158073982_n.jpg","/images/social/480560588_926792662983874_1058320082541589783_n.jpg","/images/social/480561130_926790229650784_8733510563304689261_n.jpg","/images/social/480566840_926780632985077_6647682852966162293_n.jpg","/images/social/480589249_926153459714461_6764138263823176850_n.jpg","/images/social/480614142_926169876379486_1768841067875247615_n.jpg","/images/social/480623090_926792739650533_7056274322314108689_n.jpg","/images/social/480680851_926996632963477_8731923500186973471_n.jpg","/images/social/480696805_926151219714685_686220387681476845_n.jpg","/images/social/480752060_926169516379522_7224052795722044585_n.jpg","/images/social/480799333_926163563046784_3127008417383797050_n.jpg","/images/social/480845587_926813742981766_9145118396344043794_n.jpg","/images/social/480899284_926780672985073_6591451876333892023_n.jpg","/images/social/480973095_932951432367997_1387701997909602513_n.jpg","/images/social/480996985_926153586381115_4621810672483818792_n.jpg","/images/social/481011908_926169769712830_3745922761519086323_n.jpg","/images/social/481058827_926996636296810_483218624903612956_n.jpg","/images/social/481125638_930542442608896_498978692714192307_n.jpg","/images/social/481148540_926996986296775_7163603541267386842_n.jpg","/images/social/481162414_930542595942214_8917195157043767649_n.jpg","/images/social/481199379_932961742366966_6627788129579107360_n.jpg","/images/social/481236633_926169579712849_5755512725146972833_n.jpg","/images/social/481270081_926169726379501_4092318569778364891_n.jpg","/images/social/481271872_932953892367751_7783240656483083191_n.jpg","/images/social/481298929_926816692981471_3741164025100342357_n.jpg","/images/social/481346673_932951289034678_2198527791318259754_n.jpg","/images/social/481661513_932961745700299_3377123349328120066_n.jpg","/images/social/481666988_932283429101464_4907289034934264194_n.jpg","/images/social/481769903_930542702608870_855845028594698108_n.jpg","/images/social/481980444_930548332608307_533143456315264192_n.jpg","/images/social/dispatch-01.jpg","/images/social/dispatch-02.jpg","/images/social/dispatch-03.jpg","/images/social/dispatch-04.jpg","/images/social/dispatch-05.jpg","/images/social/dispatch-06.jpg","/images/social/dispatch-07.jpg","/images/social/dispatch-08.jpg","/images/social/dispatch-09.jpg","/images/social/dispatch-10.jpg","/images/social/dispatch-11.jpg","/images/social/dispatch-12.jpg","/images/social/dispatch-13.jpg","/images/social/dispatch-14.jpg","/images/social/dispatch-15.jpg","/images/social/dispatch-16.jpg","/images/social/dispatch-17.jpg","/images/social/dispatch-18.jpg","/images/social/dispatch-19.jpg","/images/social/dispatch-20.jpg","/images/social/dispatch-21.jpg","/images/social/dispatch-22.jpg","/images/social/dispatch-23.jpg","/images/social/dispatch-24.jpg","/images/social/dispatch-25.jpg","/images/social/dispatch-26.jpg","/images/social/dispatch-27.jpg","/images/social/dispatch-28.jpg","/images/social/dispatch-29.jpg","/images/social/dispatch-30.jpg","/images/social/dispatch-31.jpg","/images/social/dispatch-32.jpg","/images/social/dispatch-33.jpg","/images/social/dispatch-34.jpg","/_worker.js/chunks/astro/assets-service_DOd1vnbN.mjs","/_worker.js/chunks/astro/env-setup_nxDOIah1.mjs","/_worker.js/chunks/astro/server_Dud8S12r.mjs","/_worker.js/pages/_actions/_---path_.astro.mjs","/_worker.js/pages/api/revalidate.astro.mjs","/_worker.js/pages/treks/_slug_.astro.mjs","/about/index.html","/api/revalidate","/contact/index.html","/treks/index.html","/index.html"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"SdXAUICF/usCifq676zeugQt/BJS+Zw5rwdjJTqVi6k=","experimentalEnvGetSecretEnabled":false});

export { manifest };

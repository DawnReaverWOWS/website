import 'piccolore';
import { q as decodeKey } from './chunks/astro/server_CWjnsOI4.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_BKLdxcft.mjs';
import 'es-module-lexer';

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
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
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

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Projects/DawnReaver/www/","cacheDir":"file:///C:/Projects/DawnReaver/www/node_modules/.astro/","outDir":"file:///C:/Projects/DawnReaver/www/dist/","srcDir":"file:///C:/Projects/DawnReaver/www/src/","publicDir":"file:///C:/Projects/DawnReaver/www/public/","buildClientDir":"file:///C:/Projects/DawnReaver/www/dist/client/","buildServerDir":"file:///C:/Projects/DawnReaver/www/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"members/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/members","isIndex":false,"type":"page","pattern":"^\\/members\\/?$","segments":[[{"content":"members","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/members.astro","pathname":"/members","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"recruitment/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/recruitment","isIndex":false,"type":"page","pattern":"^\\/recruitment\\/?$","segments":[[{"content":"recruitment","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/recruitment.astro","pathname":"/recruitment","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"stats/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/stats","isIndex":false,"type":"page","pattern":"^\\/stats\\/?$","segments":[[{"content":"stats","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/stats.astro","pathname":"/stats","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[{"type":"external","src":"/_astro/announcements.BkFwLBgI.css"},{"type":"inline","content":".prose-steel[data-astro-cid-6n4c4ken] p[data-astro-cid-6n4c4ken]{color:rgb(var(--color-text-secondary))}\n"}],"routeData":{"route":"/announcements","isIndex":false,"type":"page","pattern":"^\\/announcements\\/?$","segments":[[{"content":"announcements","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/announcements.astro","pathname":"/announcements","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[],"routeData":{"route":"/api/announcements/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/announcements\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"announcements","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/announcements/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[],"routeData":{"route":"/api/announcements","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/announcements\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"announcements","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/announcements/index.ts","pathname":"/api/announcements","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[],"routeData":{"route":"/api/applications/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/applications\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"applications","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/applications/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[],"routeData":{"route":"/api/applications","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/applications\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"applications","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/applications/index.ts","pathname":"/api/applications","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[],"routeData":{"route":"/api/members/sync","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/members\\/sync\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"members","dynamic":false,"spread":false}],[{"content":"sync","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/members/sync.ts","pathname":"/api/members/sync","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[],"routeData":{"route":"/api/members/[discordid]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/members\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"members","dynamic":false,"spread":false}],[{"content":"discordId","dynamic":true,"spread":false}]],"params":["discordId"],"component":"src/pages/api/members/[discordId].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[],"routeData":{"route":"/api/members","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/members\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"members","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/members/index.ts","pathname":"/api/members","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[],"routeData":{"route":"/api/webhook/role-change","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/webhook\\/role-change\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"webhook","dynamic":false,"spread":false}],[{"content":"role-change","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/webhook/role-change.ts","pathname":"/api/webhook/role-change","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[{"type":"external","src":"/_astro/announcements.BkFwLBgI.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"https://dawnreaver.com","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Projects/DawnReaver/www/src/pages/announcements.astro",{"propagation":"none","containsHead":true}],["C:/Projects/DawnReaver/www/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Projects/DawnReaver/www/src/pages/members.astro",{"propagation":"none","containsHead":true}],["C:/Projects/DawnReaver/www/src/pages/recruitment.astro",{"propagation":"none","containsHead":true}],["C:/Projects/DawnReaver/www/src/pages/stats.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/announcements@_@astro":"pages/announcements.astro.mjs","\u0000@astro-page:src/pages/api/announcements/[id]@_@ts":"pages/api/announcements/_id_.astro.mjs","\u0000@astro-page:src/pages/api/announcements/index@_@ts":"pages/api/announcements.astro.mjs","\u0000@astro-page:src/pages/api/applications/[id]@_@ts":"pages/api/applications/_id_.astro.mjs","\u0000@astro-page:src/pages/api/applications/index@_@ts":"pages/api/applications.astro.mjs","\u0000@astro-page:src/pages/api/members/sync@_@ts":"pages/api/members/sync.astro.mjs","\u0000@astro-page:src/pages/api/members/[discordId]@_@ts":"pages/api/members/_discordid_.astro.mjs","\u0000@astro-page:src/pages/api/members/index@_@ts":"pages/api/members.astro.mjs","\u0000@astro-page:src/pages/api/webhook/role-change@_@ts":"pages/api/webhook/role-change.astro.mjs","\u0000@astro-page:src/pages/members@_@astro":"pages/members.astro.mjs","\u0000@astro-page:src/pages/recruitment@_@astro":"pages/recruitment.astro.mjs","\u0000@astro-page:src/pages/stats@_@astro":"pages/stats.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_BZJcCRZK.mjs","C:/Projects/DawnReaver/www/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_D7fSJjuq.mjs","C:/Projects/DawnReaver/www/src/components/Navigation.astro?astro&type=script&index=0&lang.ts":"_astro/Navigation.astro_astro_type_script_index_0_lang.d6V8J2CV.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["C:/Projects/DawnReaver/www/src/components/Navigation.astro?astro&type=script&index=0&lang.ts","const e=document.getElementById(\"mobile-menu-button\"),t=document.getElementById(\"mobile-menu\");e?.addEventListener(\"click\",()=>{t?.classList.toggle(\"hidden\")});"]],"assets":["/_astro/announcements.BkFwLBgI.css","/favicon.svg","/members/index.html","/recruitment/index.html","/stats/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"tJ9HVYMjntiuiEHijiGChQ6fxYZkq0zBZGTf3yVqto8="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };

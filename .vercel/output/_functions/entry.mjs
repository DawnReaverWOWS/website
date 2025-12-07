import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_Bax8Wh7U.mjs';
import { manifest } from './manifest_BZJcCRZK.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/announcements.astro.mjs');
const _page2 = () => import('./pages/api/announcements/_id_.astro.mjs');
const _page3 = () => import('./pages/api/announcements.astro.mjs');
const _page4 = () => import('./pages/api/applications/_id_.astro.mjs');
const _page5 = () => import('./pages/api/applications.astro.mjs');
const _page6 = () => import('./pages/api/members/sync.astro.mjs');
const _page7 = () => import('./pages/api/members/_discordid_.astro.mjs');
const _page8 = () => import('./pages/api/members.astro.mjs');
const _page9 = () => import('./pages/api/webhook/role-change.astro.mjs');
const _page10 = () => import('./pages/members.astro.mjs');
const _page11 = () => import('./pages/recruitment.astro.mjs');
const _page12 = () => import('./pages/stats.astro.mjs');
const _page13 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/announcements.astro", _page1],
    ["src/pages/api/announcements/[id].ts", _page2],
    ["src/pages/api/announcements/index.ts", _page3],
    ["src/pages/api/applications/[id].ts", _page4],
    ["src/pages/api/applications/index.ts", _page5],
    ["src/pages/api/members/sync.ts", _page6],
    ["src/pages/api/members/[discordId].ts", _page7],
    ["src/pages/api/members/index.ts", _page8],
    ["src/pages/api/webhook/role-change.ts", _page9],
    ["src/pages/members.astro", _page10],
    ["src/pages/recruitment.astro", _page11],
    ["src/pages/stats.astro", _page12],
    ["src/pages/index.astro", _page13]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "a5117df3-80c4-4449-ad02-ed14e5e46c57",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };

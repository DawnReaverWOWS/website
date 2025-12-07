import { e as createAstro, f as createComponent, h as addAttribute, n as renderHead, o as renderSlot, r as renderTemplate, m as maybeRenderHead, p as renderScript } from './astro/server_CWjnsOI4.mjs';
import 'piccolore';
import 'clsx';
/* empty css                                 */

const $$Astro$1 = createAstro("https://dawnreaver.com");
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title, description = "DawnReaver - Professional World of Warships Gaming Clan" } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"${addAttribute(description, "content")}><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title><!-- Favicon --><link rel="icon" type="image/svg+xml" href="/favicon.svg"><!-- Open Graph / Social Media --><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:type" content="website"><meta property="og:site_name" content="DawnReaver"><!-- Twitter --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(description, "content")}>${renderHead()}</head> <body class="bg-navy-950 text-text-primary min-h-screen relative overflow-x-hidden"> <!-- Optional: Dark grid pattern overlay for gaming aesthetic --> <div class="fixed inset-0 pointer-events-none opacity-5" style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 20px 20px;"></div> <div class="relative z-10"> ${renderSlot($$result, $$slots["default"])} </div> </body></html>`;
}, "C:/Projects/DawnReaver/www/src/layouts/BaseLayout.astro", void 0);

const $$Astro = createAstro("https://dawnreaver.com");
const $$Navigation = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Navigation;
  const currentPath = Astro2.url.pathname;
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/announcements", label: "News" },
    { href: "/members", label: "Roster" },
    { href: "/stats", label: "Stats" },
    { href: "/recruitment", label: "Recruitment" }
  ];
  return renderTemplate`${maybeRenderHead()}<nav class="bg-navy-900 border-b border-navy-700 shadow-lg"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="flex items-center justify-between h-14"> <!-- Logo/Brand --> <a href="/" class="flex items-center space-x-3 hover:opacity-80 transition-opacity"> <span class="text-gold-DEFAULT text-2xl font-display font-bold glow-gold">[DAWN]</span> <span class="text-xl font-bold text-text-primary">DawnReaver</span> </a> <!-- Navigation Links --> <div class="hidden md:flex space-x-6"> ${navLinks.map((link) => renderTemplate`<a${addAttribute(link.href, "href")}${addAttribute([
    "px-3 py-2 text-sm font-bold uppercase tracking-wide transition-colors",
    currentPath === link.href ? "text-gold-DEFAULT border-b-2 border-gold-DEFAULT" : "text-steel-light hover:text-gold-DEFAULT"
  ], "class:list")}> ${link.label} </a>`)} </div> <!-- Mobile Menu Button --> <div class="md:hidden"> <button id="mobile-menu-button" type="button" class="text-steel-light hover:text-gold-DEFAULT focus:outline-none" aria-label="Toggle menu"> <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg> </button> </div> </div> </div> <!-- Mobile Menu --> <div id="mobile-menu" class="hidden md:hidden bg-navy-800 border-t border-navy-700"> <div class="px-2 pt-2 pb-3 space-y-1"> ${navLinks.map((link) => renderTemplate`<a${addAttribute(link.href, "href")}${addAttribute([
    "block px-3 py-2 text-sm font-bold uppercase tracking-wide transition-colors",
    currentPath === link.href ? "text-gold-DEFAULT bg-navy-700" : "text-steel-light hover:text-gold-DEFAULT hover:bg-navy-700"
  ], "class:list")}> ${link.label} </a>`)} </div> </div> </nav> ${renderScript($$result, "C:/Projects/DawnReaver/www/src/components/Navigation.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Projects/DawnReaver/www/src/components/Navigation.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return renderTemplate`${maybeRenderHead()}<footer class="bg-navy-900 border-t border-navy-700 mt-12"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <div class="grid grid-cols-1 md:grid-cols-3 gap-8"> <!-- About --> <div> <h3 class="text-gold-DEFAULT text-lg font-display font-bold mb-4 uppercase">DawnReaver [DAWN]</h3> <p class="text-text-secondary text-sm">
Elite World of Warships clan dedicated to competitive clan battles, tactical excellence, and naval supremacy.
</p> </div> <!-- Quick Links --> <div> <h3 class="text-gold-DEFAULT text-lg font-display font-bold mb-4 uppercase">Quick Links</h3> <ul class="space-y-2 text-sm"> <li> <a href="/" class="text-steel-light hover:text-gold-DEFAULT transition-colors">
Home
</a> </li> <li> <a href="/members" class="text-steel-light hover:text-gold-DEFAULT transition-colors">
Roster
</a> </li> <li> <a href="/stats" class="text-steel-light hover:text-gold-DEFAULT transition-colors">
Statistics
</a> </li> <li> <a href="/recruitment" class="text-steel-light hover:text-gold-DEFAULT transition-colors">
Recruitment
</a> </li> </ul> </div> <!-- External Links --> <div> <h3 class="text-gold-DEFAULT text-lg font-display font-bold mb-4 uppercase">Connect</h3> <ul class="space-y-2 text-sm"> <li> <a href="https://discord.gg/MmQzx7Uj" target="_blank" rel="noopener noreferrer" class="text-cyan-glow hover:text-gold-DEFAULT transition-colors flex items-center gap-2"> <span>💬</span> Join Discord
</a> </li> <li> <a href="https://worldofwarships.com" target="_blank" rel="noopener noreferrer" class="text-steel-light hover:text-gold-DEFAULT transition-colors">
World of Warships
</a> </li> <li> <a href="https://na.wows-numbers.com/clan/1000109881,GUNIT-United-Gunners/" target="_blank" rel="noopener noreferrer" class="text-steel-light hover:text-gold-DEFAULT transition-colors">
Clan Stats (WoWS Numbers)
</a> </li> </ul> </div> </div> <div class="border-t border-navy-700 mt-8 pt-8 text-center text-sm text-text-tertiary"> <p>
&copy; ${currentYear} DawnReaver [DAWN]. All rights reserved.
</p> <p class="mt-2 text-xs">
This site is not affiliated with Wargaming.net. World of Warships is a trademark of Wargaming.net.
</p> </div> </div> </footer>`;
}, "C:/Projects/DawnReaver/www/src/components/Footer.astro", void 0);

export { $$BaseLayout as $, $$Navigation as a, $$Footer as b };

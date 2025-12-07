import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute, l as Fragment } from '../chunks/astro/server_CWjnsOI4.mjs';
import 'piccolore';
import { $ as $$BaseLayout, a as $$Navigation, b as $$Footer } from '../chunks/Footer_4JG4lVl5.mjs';
import { d as db, a as announcements } from '../chunks/index_CJ7lrqfB.mjs';
import { eq, desc } from 'drizzle-orm';
export { renderers } from '../renderers.mjs';

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const recentAnnouncements = await db.select().from(announcements).where(eq(announcements.isPublic, true)).orderBy(desc(announcements.isPinned), desc(announcements.createdAt)).limit(3);
  const categoryInfo = {
    general: { label: "General", color: "text-steel-light" },
    clan_battle: { label: "Clan Battle", color: "text-gold-DEFAULT" },
    event: { label: "Event", color: "text-cyan-glow" },
    maintenance: { label: "Maintenance", color: "text-red-alert" }
  };
  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }
  function truncateContent(content, maxLength = 100) {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength).trim() + "...";
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "DawnReaver [DAWN] - Elite WoWS Clan", "description": "DawnReaver - Elite World of Warships clan. Competitive clan battles, tactical excellence, and naval supremacy." }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navigation", $$Navigation, {})}  ${maybeRenderHead()}<section class="relative h-[35vh] min-h-[300px] max-h-[400px] flex items-center justify-center overflow-hidden"> <!-- Background --> <div class="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-800 to-navy-950"> <div class="absolute inset-0 opacity-20" style="background-image: url('https://images.unsplash.com/photo-1574680796665-4d71f49b1f7c?w=1920'); background-size: cover; background-position: center;"></div> </div> <div class="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent"></div> <!-- Hero Content --> <div class="relative z-10 text-center px-4"> <div class="mb-3"> <div class="text-gold-DEFAULT text-5xl xl:text-6xl 2xl:text-7xl font-display font-bold glow-gold tracking-wider">
[DAWN]
</div> <h1 class="text-3xl xl:text-4xl 2xl:text-5xl font-display font-bold text-text-primary mt-2 tracking-wide">
DAWNREAVER
</h1> </div> <p class="text-steel-light text-base xl:text-lg 2xl:text-xl font-semibold uppercase tracking-widest mb-4">
Naval Superiority | Clan Battles | Tactical Excellence
</p> <div class="flex flex-col sm:flex-row gap-2 justify-center"> <a href="/members" class="steel-panel px-5 py-2 text-gold-DEFAULT font-bold uppercase tracking-wide hover:bg-gold-DEFAULT hover:text-navy-950 transition-all alert-border text-sm">
View Roster
</a> <a href="/recruitment" class="steel-panel px-5 py-2 text-cyan-glow font-bold uppercase tracking-wide hover:bg-cyan-glow hover:text-navy-950 transition-all text-sm">
Join the Fleet
</a> <a href="/stats" class="steel-panel px-5 py-2 text-steel-light font-bold uppercase tracking-wide hover:bg-steel-light hover:text-navy-950 transition-all text-sm">
Statistics
</a> </div> </div> <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-glow to-transparent opacity-50 animate-pulse"></div> </section> <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 xl:py-4"> <!-- ABOUT SECTION & QUICK INFO - Compact Grid --> <section class="mb-3 xl:mb-4"> <div class="grid grid-cols-1 lg:grid-cols-3 gap-3"> <!-- About Panel --> <div class="steel-panel p-3 lg:col-span-2"> <h2 class="text-xl xl:text-2xl font-display font-bold text-gold-DEFAULT mb-2 uppercase">Our Mission</h2> <p class="text-text-secondary text-sm xl:text-base leading-relaxed">
DawnReaver is an elite World of Warships clan dedicated to <span class="text-gold-DEFAULT font-semibold">competitive clan battles</span>,
            strategic naval warfare, and tactical excellence. We maintain the highest standards of skill, communication, and teamwork
            while fostering a tight-knit community of dedicated captains.
</p> <div class="mt-2 flex flex-wrap gap-2"> <div class="flex items-center gap-2"> <div class="w-2 h-2 bg-gold-DEFAULT rounded-full"></div> <span class="text-text-primary font-semibold text-xs xl:text-sm">Server: NA</span> </div> <div class="flex items-center gap-2"> <div class="w-2 h-2 bg-cyan-glow rounded-full"></div> <span class="text-text-primary font-semibold text-xs xl:text-sm">Focus: Clan Battles</span> </div> <div class="flex items-center gap-2"> <div class="w-2 h-2 bg-red-alert rounded-full"></div> <span class="text-text-primary font-semibold text-xs xl:text-sm">Competitive</span> </div> </div> </div> <!-- Quick Stats --> <div class="steel-panel p-3 flex flex-col justify-center gap-2"> <div class="text-center"> <div class="text-2xl xl:text-3xl font-display font-bold text-cyan-glow">45%+</div> <div class="text-steel-light text-xs uppercase">Min Win Rate</div> </div> <div class="text-center"> <div class="text-2xl xl:text-3xl font-display font-bold text-gold-DEFAULT">Tier VII+</div> <div class="text-steel-light text-xs uppercase">Ships Required</div> </div> <div class="text-center"> <div class="text-2xl xl:text-3xl font-display font-bold text-cyan-glow">8PM EST</div> <div class="text-steel-light text-xs uppercase">Mon/Wed/Fri</div> </div> </div> </div> </section> <!-- RECENT ANNOUNCEMENTS --> ${recentAnnouncements.length > 0 && renderTemplate`<section class="mb-3 xl:mb-4"> <div class="flex items-center justify-between mb-2"> <h2 class="text-xl xl:text-2xl font-display font-bold text-gold-DEFAULT uppercase">
Recent Announcements
</h2> <a href="/announcements" class="text-cyan-glow text-sm hover:underline font-semibold">
View All →
</a> </div> <div class="space-y-2"> ${recentAnnouncements.map((announcement) => {
    const categoryData = categoryInfo[announcement.category || "general"];
    return renderTemplate`<article${addAttribute([
      "steel-panel p-3",
      announcement.isPinned && "alert-border"
    ], "class:list")}> <div class="flex items-start justify-between gap-3"> <div class="flex-1 min-w-0"> <div class="flex items-center gap-2 mb-1"> ${announcement.isPinned && renderTemplate`<span class="text-gold-DEFAULT" title="Pinned">📌</span>`} <h3 class="text-base xl:text-lg font-display font-bold text-text-primary truncate"> ${announcement.title} </h3> </div> <p class="text-text-secondary text-xs xl:text-sm mb-2 line-clamp-2"> ${truncateContent(announcement.content, 120)} </p> <div class="flex flex-wrap items-center gap-2 text-xs text-text-secondary"> <span class="text-cyan-glow font-semibold">${announcement.author}</span> <span>•</span> <time${addAttribute(announcement.createdAt?.toISOString(), "datetime")}> ${formatDate(announcement.createdAt)} </time> ${categoryData && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <span>•</span> <span${addAttribute(["font-semibold", categoryData.color], "class:list")}> ${categoryData.label} </span> ` })}`} </div> </div> </div> </article>`;
  })} </div> </section>`} <!-- FEATURES GRID - Compact (2 key features) --> <section class="mb-3 xl:mb-4"> <h2 class="text-xl xl:text-2xl font-display font-bold text-gold-DEFAULT mb-2 text-center glow-gold uppercase">
Why Join DawnReaver?
</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-3"> <div class="steel-panel p-3 flex items-start gap-3"> <span class="text-2xl xl:text-3xl">🏆</span> <div> <h3 class="text-base xl:text-lg font-bold text-gold-DEFAULT mb-1">Competitive Excellence</h3> <p class="text-text-secondary text-xs xl:text-sm">Typhoon League clan battles with experienced leadership and tactical coordination.</p> </div> </div> <div class="steel-panel p-3 flex items-start gap-3"> <span class="text-2xl xl:text-3xl">👥</span> <div> <h3 class="text-base xl:text-lg font-bold text-gold-DEFAULT mb-1">Active Community</h3> <p class="text-text-secondary text-xs xl:text-sm">Discord with dedicated captains, organized divisions, and fully upgraded naval base.</p> </div> </div> </div> </section> <!-- CTA - Compact --> <section class="text-center steel-panel p-3 xl:p-4 alert-border"> <h2 class="text-2xl xl:text-3xl font-display font-bold text-gold-DEFAULT glow-gold mb-2 uppercase">
Ready for Battle?
</h2> <p class="text-steel-light text-sm xl:text-base mb-3">
Join DawnReaver and dominate the seas with elite tactical gameplay.
</p> <div class="flex flex-col sm:flex-row gap-2 justify-center"> <a href="/recruitment" class="steel-panel px-5 py-2 text-gold-DEFAULT font-display font-bold uppercase tracking-wide hover:bg-gold-DEFAULT hover:text-navy-950 transition-all text-sm">
Apply Now
</a> <a href="/members" class="steel-panel px-5 py-2 text-cyan-glow font-display font-bold uppercase tracking-wide hover:bg-cyan-glow hover:text-navy-950 transition-all text-sm">
View Fleet
</a> </div> </section> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "C:/Projects/DawnReaver/www/src/pages/index.astro", void 0);

const $$file = "C:/Projects/DawnReaver/www/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

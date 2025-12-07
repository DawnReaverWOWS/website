import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute, l as Fragment } from '../chunks/astro/server_CWjnsOI4.mjs';
import 'piccolore';
import { $ as $$BaseLayout, a as $$Navigation, b as $$Footer } from '../chunks/Footer_4JG4lVl5.mjs';
import { d as db, a as announcements } from '../chunks/index_CJ7lrqfB.mjs';
import { eq, desc } from 'drizzle-orm';
/* empty css                                         */
export { renderers } from '../renderers.mjs';

const prerender = false;
const $$Announcements = createComponent(async ($$result, $$props, $$slots) => {
  const publicAnnouncements = await db.select().from(announcements).where(eq(announcements.isPublic, true)).orderBy(desc(announcements.isPinned), desc(announcements.createdAt)).limit(50);
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
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Announcements - DawnReaver [DAWN]", "description": "Latest updates and announcements from DawnReaver clan leadership.", "data-astro-cid-6n4c4ken": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navigation", $$Navigation, { "data-astro-cid-6n4c4ken": true })} ${maybeRenderHead()}<main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-astro-cid-6n4c4ken> <!-- Page Header --> <div class="mb-8 text-center" data-astro-cid-6n4c4ken> <h1 class="text-4xl xl:text-5xl font-display font-bold text-gold-DEFAULT mb-3 glow-gold uppercase" data-astro-cid-6n4c4ken>
Announcements
</h1> <p class="text-steel-light text-lg" data-astro-cid-6n4c4ken>
Stay updated with the latest clan news and updates
</p> </div> <!-- Announcements List --> ${publicAnnouncements.length === 0 ? renderTemplate`<div class="steel-panel p-8 text-center" data-astro-cid-6n4c4ken> <p class="text-text-secondary text-lg" data-astro-cid-6n4c4ken>No announcements yet. Check back soon!</p> </div>` : renderTemplate`<div class="space-y-4" data-astro-cid-6n4c4ken> ${publicAnnouncements.map((announcement) => {
    const categoryData = categoryInfo[announcement.category || "general"];
    return renderTemplate`<article${addAttribute([
      "steel-panel p-6",
      announcement.isPinned && "alert-border"
    ], "class:list")} data-astro-cid-6n4c4ken> <!-- Header --> <div class="flex items-start justify-between mb-3" data-astro-cid-6n4c4ken> <div class="flex-1" data-astro-cid-6n4c4ken> <div class="flex items-center gap-3 mb-2" data-astro-cid-6n4c4ken> ${announcement.isPinned && renderTemplate`<span class="text-gold-DEFAULT text-lg" title="Pinned" data-astro-cid-6n4c4ken>📌</span>`} <h2 class="text-2xl font-display font-bold text-text-primary" data-astro-cid-6n4c4ken> ${announcement.title} </h2> </div> <div class="flex flex-wrap items-center gap-3 text-sm text-text-secondary" data-astro-cid-6n4c4ken> <span class="flex items-center gap-1" data-astro-cid-6n4c4ken> <span class="text-cyan-glow" data-astro-cid-6n4c4ken>👤</span> ${announcement.author} </span> <span data-astro-cid-6n4c4ken>•</span> <time${addAttribute(announcement.createdAt?.toISOString(), "datetime")} data-astro-cid-6n4c4ken> ${formatDate(announcement.createdAt)} </time> ${categoryData && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-6n4c4ken": true }, { "default": async ($$result3) => renderTemplate` <span data-astro-cid-6n4c4ken>•</span> <span${addAttribute(["font-semibold", categoryData.color], "class:list")} data-astro-cid-6n4c4ken> ${categoryData.label} </span> ` })}`} </div> </div> </div> <!-- Content --> <div class="prose prose-invert prose-steel max-w-none" data-astro-cid-6n4c4ken> <p class="text-text-secondary whitespace-pre-wrap leading-relaxed" data-astro-cid-6n4c4ken> ${announcement.content} </p> </div> </article>`;
  })} </div>`} <!-- Back Button --> <div class="mt-8 text-center" data-astro-cid-6n4c4ken> <a href="/" class="steel-panel px-6 py-3 text-cyan-glow font-display font-bold uppercase tracking-wide hover:bg-cyan-glow hover:text-navy-950 transition-all inline-block" data-astro-cid-6n4c4ken>
← Back to Home
</a> </div> </main> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-6n4c4ken": true })} ` })} `;
}, "C:/Projects/DawnReaver/www/src/pages/announcements.astro", void 0);

const $$file = "C:/Projects/DawnReaver/www/src/pages/announcements.astro";
const $$url = "/announcements";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Announcements,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

# DawnReaver Website Setup Guide

## Quick Start

Your website is deployed at: **https://website-seven-sable-40.vercel.app/**

## Configure Your Clan Data

To display your actual clan data, follow these steps:

### 1. Find Your Clan ID

1. Visit [WoWS Numbers](https://na.wows-numbers.com/)
2. Search for your clan name (e.g., "DAWN")
3. Open your clan page
4. Look at the URL - it will be something like: `https://na.wows-numbers.com/clan/1000109881,DAWN-DawnReaver/`
5. The number `1000109881` is your **Clan ID**

### 2. Set Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Open your project: **DawnReaverWOWS/website**
3. Click **Settings** → **Environment Variables**
4. Add these variables:

   | Key | Value | Description |
   |-----|-------|-------------|
   | `WARGAMING_APP_ID` | `007e439533b8d74a7d831b1822603499` | Your Wargaming API key |
   | `CLAN_ID` | `YOUR_CLAN_ID_HERE` | Replace with your actual clan ID |
   | `CLAN_TAG` | `DAWN` | Your clan tag |
   | `CLAN_NAME` | `DawnReaver` | Your clan name |

5. Click **Save**
6. Go to **Deployments** → Find latest deployment → Click **⋯** → **Redeploy**

### 3. Verify It's Working

After redeployment (takes ~2 minutes):
- Visit your website
- You should see your clan emblem, real member count, and statistics
- Navigate to **Members** page to see full roster with live stats
- Check **Statistics** page for leaderboards

## Features

✅ **Homepage**
- Clan emblem, name, and member count
- Aggregate statistics (total battles, avg win rate, avg damage)
- Top 5 performers ranked by PR
- About section
- Join CTA button

✅ **Members Page**
- Full member roster in sortable table
- Real-time stats per player:
  - Battles played
  - Win Rate (%)
  - Average Damage
  - Personal Rating (PR) with color coding
  - Last battle time
- Clan role badges (Commander, Officer, etc.)

✅ **Statistics Page**
- Clan overview metrics
- Top 10 leaderboards:
  - By Personal Rating (PR)
  - By Win Rate
  - By Average Damage
  - By Most Battles

## Color Scheme

- **Primary Blue:** #003366 (Deep navy blue)
- **Secondary Blue:** #0055AA (Bright blue)
- **Gold Accent:** #FFD700 (Gold)
- **White Background:** #FFFFFF

## Tech Stack

- **Framework:** Astro 4.x + TypeScript
- **Styling:** Tailwind CSS v4
- **API:** Wargaming World of Warships Public API
- **Deployment:** Vercel (static site generation)
- **Caching:** In-memory cache (30min clan, 15min members, 5min stats)

## Troubleshooting

**Q: Website shows "Configure your clan ID"**
→ You haven't set the `CLAN_ID` environment variable in Vercel yet.

**Q: Member stats show "Hidden"**
→ That player has their profile set to private in WoWS.

**Q: Stats seem outdated**
→ Data is cached for performance. Wait 5-30 minutes or redeploy to force refresh.

**Q: API errors in build logs**
→ Check that your Clan ID is correct and exists on the NA server.

## Local Development

```bash
# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env and add your CLAN_ID
nano .env

# Run development server
npm run dev

# Build for production
npm run build
```

## Support

- **Wargaming API Docs:** https://developers.wargaming.net/reference/all/wows/
- **Vercel Docs:** https://vercel.com/docs
- **Astro Docs:** https://docs.astro.build

---

**Note:** This website fetches data from the Wargaming API at build time. Vercel will automatically rebuild your site when you push changes to GitHub. You can also manually trigger rebuilds from the Vercel dashboard to refresh data.

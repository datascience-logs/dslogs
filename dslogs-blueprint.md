# Dslogs Website Blueprint

## Overview
A resource hub for data science students linked to an Instagram channel.  
The website's core function: **visitors enter a code (e.g. `Dslogs-001`) and unlock a resource page** — a blog article, cheat sheet, interview prep, etc.

**Code format:** `Dslogs-{number}` (simple auto-incrementing sequence).  
**Content creation:** Admin pastes Markdown, uploads optional PDF.  
**Monetisation:** None initially; placeholder spots for future ads/sponsors.

---

## Pages & Structure

### 1. Homepage (`/`)
- **Large centered search box**  
  Placeholder: `"Enter your Dslogs code…"`
- Subtitle: `"Unlock exclusive data science resources from Instagram."`
- **Search behavior:**
  - Valid code: Show unlock animation (2-3 sec overlay), then fade into the resource page.
  - Invalid code: Friendly error `"Code not found. Did you spell it correctly?"` with a link to `/library`.
- **Recent Instagram posts widget** (embedded feed, clickable thumbnails linking to actual Instagram post).
- Navigation menu (present on all pages):  
  `Home | All Resources | About`  
  + Instagram icon (link to profile)
- Optional: `"Latest Code"` teaser showing the most recently added code (for bio link visitors).

### 2. Resource Page (unlocked via code, e.g. `/resource/dslogs-001`)
- Title of the resource.
- Highlighted text: `"Unlocked with code: Dslogs-001"`.
- Content rendered from Markdown.
- **Fixed Call-to-Actions (always present):**
  - "Follow on Instagram" → link to profile.
  - "Comment on this post" → link to the specific Instagram post (you set this link per resource).
- **Optional Call-to-Action (set per resource):**
  - Download PDF button (if PDF uploaded).
  - Social share buttons.
  - Email sign-up link (if desired).
- Back to Library link.
- Instagram feed widget (small version at bottom or sidebar).

### 3. All Resources / Library Page (`/library`)
- Grid or list of all resources.
- Filterable by category/tag (e.g., Python, SQL, Interview, Resume, etc.).
- Each resource card shows:
  - Title
  - Date published
  - Short excerpt (first ~150 chars of content)
  - Code (e.g. `Dslogs-001`)
- Clicking a card goes directly to the resource page; no code required from this page.
- Optional: "Copy code" button on each card.

### 4. About Page (`/about`)
- Your photo.
- Personal story: why you started the Instagram channel, struggles, and mission.
- Mission statement: `"Making data science resources easy, free, and accessible for every student."`
- Links: Instagram, contact/DM option.
- Instagram feed widget.

---

## Admin Panel (password-protected, single user)
- **Simple login** (only you).
- **Dashboard to manage resources:**
  - Create new:
    - Title input
    - Markdown text box (paste content, no live preview needed)
    - PDF upload field (optional)
    - Optional CTA selector (dropdown: None / Download PDF / Share / Email sign-up)
    - **Auto-generate code on save** (next sequential number). Display generated code for copying.
  - Edit/delete existing resources.
  - View list of all resources with their codes and dates.
- No user management or roles needed.

---

## Key Features & Behavior

### Code System
- Auto-increment starting from `Dslogs-001` (or `Dslogs-1` without leading zeros, up to you).
- Codes are assigned automatically when a resource is saved.
- The admin sees the code after creation and copies it to Instagram.

### Search / Unlock Flow
1. Visitor types `Dslogs-005` on homepage.
2. Check if code exists.
3. If yes: overlay appears (2-3 seconds) with text `"Unlocking your resource…"` and a subtle animation (fade/slide/key icon). Then redirect to the resource page.
4. If no: error message, suggest library.

### Markdown Rendering
- Admin writes in Markdown (headings, bold, lists, links, images).
- The public resource page renders it as clean HTML with friendly typography.

### PDF Downloads
- Admin uploads a PDF per resource.
- If a PDF exists, a styled "Download PDF" button appears in the optional CTA area on the resource page.

### Instagram Integration
- Embedded Instagram feed (official `instafeed.js` or similar) on Homepage, About, and optionally on resource pages.
- Each thumbnail links out to the specific Instagram post (opens in new tab).
- The "Comment on this post" link (fixed CTA) is manually entered per resource (the URL of the Instagram post).

### Future Monetisation
- Placeholder `<div>` areas in the layout:
  - Below resource content (for banner ads).
  - Sidebar (if present, for sponsor images).
- You can add Google AdSense or manual sponsor banners later without redesign.

---

## Design & Personality

**Vibe:** Clean, minimal, friendly, colourful.  
- Light background (white/off-white), plenty of whitespace.  
- Accent colours: warm orange, soft teal, or pastel gradient.  
- Rounded corners on cards and buttons.  
- Friendly micro-copy (e.g., "Got a code? Pop it in below ✨").  
- Search bar is the hero element — large, inviting, maybe with a small key icon.  
- Fonts: modern sans-serif, clear hierarchy.  
- Instagram widget brings dynamic colour and personality.

---

## Tech Stack Suggestions (if you're building from scratch)

Since you're coding it yourself, here's a minimal stack you might use:
- **Frontend:** Plain HTML/CSS/JS or a lightweight framework (like Astro, Hugo if static) – no heavy SPA required.
- **Backend:** Simple Node.js/Express or Python/Flask – just enough to handle admin auth, CRUD for resources, and code lookup.
- **Storage:** Markdown content stored in database (supabase
/PostgreSQL) or flat files. PDFs stored on server or cloud (S3/Cloudinary).
- **Markdown rendering:** Use a library like `marked` (JS) or `markdown-it` for the resource page.
- **Instagram feed:** You can use a client-side script (like `instafeed.js`) with an access token, or fetch Instagram's basic display API server-side.

**Alternatively:** you could use a headless CMS (like Strapi or Ghost) with a custom frontend — that might save time on admin panel building.

---

## User Flow Summary

1. **From Instagram:**  
   User sees post/DM → gets code + website link → visits `yourwebsite.com` → enters code → unlock animation → reads resource → follows/comments/downloads.

2. **From Bio link:**  
   Lands on homepage → can see recent Instagram posts or latest code hint → enters code or browses library.

3. **From Library:**  
   Clicks a resource → reads → interacts with CTAs.

---

## Final Notes
- Keep everything fast and mobile-friendly — most traffic will come from Instagram (phone users).
- The unlock animation should not slow down the page; a simple CSS transition is enough.
- You can start with a minimum viable version: homepage with search, resource pages, and an admin form that writes to a JSON file (no complex backend). Later upgrade to a proper admin panel.
- The code system is simply a lookup table: code -> resource ID/URL. That's the only "smart" part.

---

**You now have a complete, build-ready plan.**  
Save this as `dslogs-blueprint.md` and start coding page by page. Good luck! 👍
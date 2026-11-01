# samkough.com

A website that preserves information about the Samkough family: a family tree,
a page for each person, books by family members, and research about Amin
Samkough with translated sources.

## How the site is built

- **[Astro](https://docs.astro.build)** builds a fully static site. There are no
  UI frameworks. The only browser JavaScript is on the family tree (collapsing
  branches) and the private files page (signing in).
- **[Netlify](https://www.netlify.com)** builds and hosts it. Every push to
  `main` deploys. `netlify.toml` sets the build command (`npm run build`), the
  output folder (`dist`), redirects, and the `/private/*` headers.
- **Node 24** (see `.nvmrc`).
- **Plain CSS** in `src/styles/`, plus small scoped `<style>` blocks in pages
  and components. No Tailwind or CSS framework.
- Pages for translated sources were written with an AI assistant. The
  [More info](src/pages/more-info.astro) page explains how, and how far to
  trust them.

### Project layout

```text
/
├── netlify/
│   ├── functions/        Private files API (sign in, list, download)
│   └── lib/session.mts   Password check and signed cookie helpers
├── public/               Files served as-is (photos, map images, book covers)
├── scripts/
│   └── private-files.mjs Command line tool for managing private PDFs
├── src/
│   ├── components/       FamilyNode, PersonCard, Gallery, Cite
│   ├── data/             The content that pages are generated from
│   ├── layouts/          Layout, PageLayout, PersonLayout
│   ├── pages/            One file per route
│   └── styles/
├── .env.sample           Names of the environment variables (no values)
└── netlify.toml
```

### Content lives in `src/data/`

Most pages are generated from a few data files, so you edit data and not
markup.

| File | What it drives |
| :--- | :--- |
| `family-tree.ts` | The family tree page and a page for every named person |
| `people.ts` | Works out each person's page, parent, spouse, children and siblings from the tree |
| `texts.ts` | The Texts index and one page per book |
| `gallery.ts`, `archive-photos.ts` | Photo galleries on Amin Samkough's pages |

**Add or change a person.** Edit `src/data/family-tree.ts`. Add a person under
their parent's `children`, or under a person's `spouses`. Anything you leave out
shows as "Unknown". A person's page appears at `/people/<name>/` (for example
`/people/zaramouk-samkough/`) and is linked from their card in the tree. Give
two people the same name and the build fails, because both would get the same
address.

Useful fields on a person: `born`, `died`, `birthplace`, `deathplace`,
`burialPlace`, `living`, `deceased`, `gender`, `arabicName`, `otherSpellings`,
`summary` (paragraphs for their page), `note`, `sources`, and `href` (links
their name in the tree to a page).

**Add a book.** Put the cover image in `public/texts/`, then add an entry to
`src/data/texts.ts`. It appears on the Texts index, gets its own page, and
shows on the author's page if the `author` matches a person's name in the
tree.

**A person with a hand-written page.** `PersonLayout` builds a person's page.
For Amin Samkough, `src/pages/people/amin-samkough/index.astro` uses it and adds
his own links through the layout's slot. For another person, create their own
`index.astro` the same way and add their slug to `customPages` in
`src/pages/people/[slug].astro`, so it isn't generated twice.

### Pages

| Route | Source |
| :--- | :--- |
| `/` | `src/pages/index.astro` |
| `/family-tree/` | `src/pages/family-tree.astro` (horizontal on desktop, a vertical outline on tablet and smaller, with collapsible branches) |
| `/people/<name>/` | `src/pages/people/[slug].astro` and `src/layouts/PersonLayout.astro` |
| `/texts/`, `/texts/<book>/` | `src/pages/texts/` |
| `/people/amin-samkough/...` | Biography, images, and the translated research section |
| `/migration/`, `/more-info/` | One page each |
| `/private/` | Password-protected files (see below) |

## Run it locally

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # builds to ./dist
npm run preview  # preview the build
```

`npm run dev` doesn't run the private files API. See
[Test private files locally](#test-private-files-locally).

## Private files

The repository is public, so anything committed to it is public. Private PDFs
are therefore **never stored in the repo**. They are kept in
[Netlify Blobs](https://docs.netlify.com/blobs/overview/) and served only to
people who know a shared family password.

### How it works

- `/private/` is a normal static page with a password form. It lists files only
  after a successful sign-in, so the page itself contains no file names.
- `POST /api/private/login` checks the password (`PRIVATE_PASSWORD`) and sets a
  signed, `HttpOnly` cookie that lasts 7 days. `POST /api/private/logout`
  clears it.
- `GET /api/private/files` lists the files, and `GET /api/private/files/<name>.pdf`
  streams one. Both return `401` without a valid cookie.
- Responses are marked `noindex` and `no-store` so search engines and caches
  skip them.

### One-time setup

1. In Netlify, go to **Site configuration → Environment variables** and add:

   | Variable | Value |
   | :--- | :--- |
   | `PRIVATE_PASSWORD` | The shared family password |
   | `PRIVATE_SESSION_SECRET` | A long random string, for example from `openssl rand -hex 32` |

2. Create a `.env` file in the project root for the upload tool. It is
   gitignored. `.env.sample` lists the names.

   ```sh
   NETLIFY_SITE_ID=your-site-id
   NETLIFY_AUTH_TOKEN=your-personal-access-token
   ```

   - The **site ID** is under **Site configuration → General** for your site.
   - The **token** is a personal access token from **User settings →
     Applications** in Netlify.

3. Deploy by pushing to `main`.

### Upload, list and delete files

Keep the PDFs outside the repo, or in `private/` at the project root, which is
gitignored. Run these from the project folder:

```sh
# Upload. The title is shown on /private/. The description is optional.
npm run private -- upload private/amin-passport.pdf "Amin Samkough passport" "Optional description"

# See what's stored
npm run private -- list

# Remove a file
npm run private -- delete amin-passport.pdf
```

- A file is stored under a cleaned-up version of its file name, for example
  `Amin Passport (1).PDF` becomes `amin-passport-1.pdf`. Uploading a file with
  the same name replaces it.
- Only real PDFs are accepted.
- Uploads take effect right away. You don't need to redeploy.
- Open `https://samkough.com/private/`, sign in, and the files are listed.

### Limits and housekeeping

- **One shared password.** Everyone uses the same one, and you can't revoke a
  single person. To lock someone out, change `PRIVATE_PASSWORD` in Netlify and
  redeploy. Changing `PRIVATE_SESSION_SECRET` as well signs everyone out
  immediately.
- **File size.** Files over about 20 MB won't download through a Netlify
  function. Compress large scans first.
- **Don't put private files in `public/` or `src/`.** Those folders are part of
  the public site and the public repo.
- Keep the file titles and descriptions bland. The file list is only shown after
  sign-in, but they are stored alongside the files.

### Test private files locally

`npm run dev` only serves the static site. To try the sign-in and the file
list, run the site through the Netlify CLI, which also provides a local
Blobs store:

```sh
PRIVATE_PASSWORD=test PRIVATE_SESSION_SECRET=anything npx netlify-cli@latest dev
```

Then open `http://localhost:8888/private/`. Files you upload with
`npm run private` go to your real Netlify site, not to this local store.

## Commands

| Command | Action |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the local dev server at `localhost:4321` |
| `npm run build` | Build the production site to `./dist/` |
| `npm run preview` | Preview the build locally |
| `npm run private -- <command>` | Manage private PDFs (`upload`, `list`, `delete`) |

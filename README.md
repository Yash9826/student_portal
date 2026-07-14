# Student Marks Portal

A React + Vite portal for a teacher to register students, record subject-wise marks,
browse/filter the class register, and export records to Excel. Data is stored in a free
**Supabase** cloud database, so it's the same whether you open the portal on a laptop, a
phone, or a school computer — no data is stuck in one browser.

## Features

- **New Registration** — enter a student's details (name, roll no, class [9–12], gender,
  date of birth, guardian/father name, mother name, category, village, scholar number,
  date of admission, contact) plus marks for any number of subjects. Add or remove
  subjects on the fly; total, percentage, and grade are calculated automatically.
- **Sidebar ledger** — every registered student is listed in the left sidebar with a quick
  search box and a grade badge.
- **All Records tab** — filter students by class, gender, category, or grade, or search by
  name/roll number/guardian/village/scholar number. Edit or delete any entry from the
  table.
- **Filter-scoped Excel export** — the Download button exports exactly the students
  currently shown on screen. Apply filters first (e.g. Class 10 + Category OBC) and only
  that filtered set is exported — not the whole register. The exported header row is
  color-coded by field group (identity, background details, subjects, summary) for
  quick scanning.
- **Shared, cloud-backed data** — every device that opens the site with the same setup sees
  the same live data.

## One-time setup: connect a free Supabase database

1. Go to [supabase.com](https://supabase.com) and create a free account + new project
   (takes about 2 minutes; pick any name/region/password).
2. In your new project, open the **SQL Editor** (left sidebar), paste in the contents of
   `supabase_schema.sql` (in this folder), and click **Run**. This creates the `students`
   and `subjects` tables and sets default access rules.
   > If you'd already set up Supabase from an earlier version of this app, just re-run the
   > updated `supabase_schema.sql` — it drops and recreates the `students` table with the
   > new field list (section removed; mother's name, category, village, scholar number,
   > and admission date added).
3. Go to **Project Settings → API**. Copy the **Project URL** and the **anon public** key.
4. In this project's root folder, copy `.env.example` to a new file named `.env`, and fill
   in the two values:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
5. That's it — run the app (below) and it will read and write to your Supabase project.

If you skip this setup, the app will show a screen with the same instructions instead of
crashing, so nothing breaks if the `.env` file is missing.

## Running it locally

You'll need [Node.js](https://nodejs.org) (18 or newer) installed.

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (usually `http://localhost:5173`).

## Deploying so it's reachable from anywhere

Since the data now lives in Supabase (not the browser), you can safely host the site
anywhere and every visitor will see the same records:

1. Push this project to GitHub (or just upload it) and connect it to
   [Vercel](https://vercel.com) or [Netlify](https://netlify.com) — both have generous free
   tiers for a small site like this.
2. In that host's project settings, add the same two environment variables from your
   `.env` file (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).
3. Deploy. Share the resulting URL with your teacher — that one link works from any device.

## Security note

The setup above uses Supabase's "anon" key with open read/write policies, meaning anyone
with the website link can add or edit records — there's no login screen. That matches the
simplicity of the original request, but if you'd like a password or teacher login before
this goes live more broadly, that's a straightforward addition using Supabase's built-in
Auth — just ask and I can add it.

## Project structure

```
src/
  components/
    Sidebar.jsx          # registered students list + search
    RegistrationForm.jsx # add/edit student + marks
    RecordsPanel.jsx     # filters, table, Excel export
    SetupNotice.jsx      # shown if Supabase isn't configured yet
  utils/
    supabaseClient.js    # Supabase connection (reads .env)
    storage.js           # reads/writes students & subjects in Supabase
    marks.js              # total/percentage/grade calculations
    exportExcel.js        # builds the .xlsx file (SheetJS)
  App.jsx                 # layout & state
supabase_schema.sql        # run once in Supabase's SQL Editor
```

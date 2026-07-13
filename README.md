# Student Marks Portal

A React + Vite portal for a teacher to register students, record subject-wise marks,
browse/filter the class register, and export records to Excel — no database required.
All data is stored locally in the browser (localStorage) on the machine it runs on.

## Features

- **New Registration** — enter a student's details (name, roll no, class, section, gender,
  date of birth, guardian name, contact) plus marks for any number of subjects. Add or
  remove subjects on the fly; total, percentage, and grade are calculated automatically.
- **Sidebar ledger** — every registered student is listed in the left sidebar with a quick
  search box and a grade badge, so the teacher can jump straight to a record.
- **All Records tab** — filter students by class, section, gender, or grade, or search by
  name/roll number/guardian. Edit or delete any entry from the table.
- **Download Excel** — exports the currently filtered list (or everyone, if no filters are
  applied) to a `.xlsx` file with all subject columns, totals, percentage, and grade.

## Running it locally

You'll need [Node.js](https://nodejs.org) (18 or newer) installed.

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (usually `http://localhost:5173`).

## Building for deployment

```bash
npm run build
```

This produces a `dist/` folder with static files you can host anywhere (Netlify, Vercel,
GitHub Pages, a school server, etc.) — it's plain HTML/CSS/JS, no server required.

## About data storage

Right now everything is saved in the browser's `localStorage`, so:
- Data persists between visits **on the same browser, same device**.
- Clearing browser data/cache will erase the records.
- It won't sync across different computers or browsers.

If you later want the teacher to access records from multiple devices, or want automatic
backups, that would need a small backend + real database (e.g. Firebase, Supabase, or a
simple Node/Express + SQLite server) — happy to help set that up when you're ready.

## Project structure

```
src/
  components/
    Sidebar.jsx          # registered students list + search
    RegistrationForm.jsx # add/edit student + marks
    RecordsPanel.jsx     # filters, table, Excel export
  utils/
    storage.js           # localStorage read/write helpers
    marks.js              # total/percentage/grade calculations
    exportExcel.js        # builds the .xlsx file (SheetJS)
  App.jsx                 # layout & state
```

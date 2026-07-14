import { useEffect, useMemo, useState } from "react";
import { computeTotals, gradeFor } from "../utils/marks";
import { exportStudentsToExcel } from "../utils/exportExcel";
import "./RecordsPanel.css";

const emptyFilters = {
  search: "",
  studentClass: "all",
  gender: "all",
  casteCategory: "all",
  grade: "all",
};

export default function RecordsPanel({ students, subjects, selectedId, onEdit, onDelete }) {
  const [filters, setFilters] = useState(emptyFilters);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const options = useMemo(() => {
    const classes = new Set();
    const genders = new Set();
    const categories = new Set();
    students.forEach((s) => {
      if (s.studentClass) classes.add(s.studentClass);
      if (s.gender) genders.add(s.gender);
      if (s.casteCategory) categories.add(s.casteCategory);
    });
    return {
      classes: [...classes].sort(),
      genders: [...genders].sort(),
      categories: [...categories].sort(),
    };
  }, [students]);

  // This is the single source of truth for what gets shown AND what gets
  // exported — the Excel download always matches exactly what's on screen.
  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return students.filter((s) => {
      const { percentage } = computeTotals(s.marks);
      const grade = gradeFor(percentage);
      if (q) {
        const hay = `${s.name} ${s.rollNo} ${s.guardianName || ""} ${s.motherName || ""} ${
          s.village || ""
        } ${s.scholarNumber || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.studentClass !== "all" && s.studentClass !== filters.studentClass) return false;
      if (filters.gender !== "all" && s.gender !== filters.gender) return false;
      if (filters.casteCategory !== "all" && s.casteCategory !== filters.casteCategory) return false;
      if (filters.grade !== "all" && grade !== filters.grade) return false;
      return true;
    });
  }, [students, filters]);

  useEffect(() => {
    if (!selectedId) return;
    const el = document.getElementById(`row-${selectedId}`);
    if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [selectedId, filtered]);

  function resetFilters() {
    setFilters(emptyFilters);
  }

  function handleExport() {
    if (filtered.length === 0) return;
    exportStudentsToExcel(filtered, subjects, "students-register.xlsx");
  }

  const filtersActive =
    filters.search || filters.studentClass !== "all" || filters.gender !== "all" ||
    filters.casteCategory !== "all" || filters.grade !== "all";

  return (
    <div className="records-panel">
      <section className="filter-bar">
        <input
          className="filter-search"
          placeholder="Search name, roll no, guardian, village..."
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
        />

        <select
          value={filters.studentClass}
          onChange={(e) => setFilters((f) => ({ ...f, studentClass: e.target.value }))}
        >
          <option value="all">All Classes</option>
          {options.classes.map((c) => (
            <option key={c} value={c}>
              Class {c}
            </option>
          ))}
        </select>

        <select value={filters.gender} onChange={(e) => setFilters((f) => ({ ...f, gender: e.target.value }))}>
          <option value="all">All Genders</option>
          {options.genders.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <select
          value={filters.casteCategory}
          onChange={(e) => setFilters((f) => ({ ...f, casteCategory: e.target.value }))}
        >
          <option value="all">All Categories</option>
          {options.categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select value={filters.grade} onChange={(e) => setFilters((f) => ({ ...f, grade: e.target.value }))}>
          <option value="all">All Grades</option>
          {["A+", "A", "B+", "B", "C", "D", "F"].map((g) => (
            <option key={g} value={g}>
              Grade {g}
            </option>
          ))}
        </select>

        <button className="filter-reset" onClick={resetFilters}>
          Reset
        </button>

        <button className="filter-export" onClick={handleExport} disabled={filtered.length === 0}>
          Download Excel ({filtered.length})
        </button>
      </section>

      {filtersActive && (
        <p className="filter-hint">
          Export downloads exactly these {filtered.length} filtered record
          {filtered.length === 1 ? "" : "s"} — not the full register.
        </p>
      )}

      <section className="records-table-wrap scrollbar-thin">
        {filtered.length === 0 ? (
          <div className="records-empty">
            {students.length === 0
              ? "The register is empty. Add a student from the New Registration tab."
              : "No students match these filters."}
          </div>
        ) : (
          <table className="records-table">
            <thead>
              <tr>
                <th>Roll</th>
                <th>Name</th>
                <th>Class</th>
                <th>Gender</th>
                <th>Category</th>
                <th>Village</th>
                <th>Scholar No</th>
                <th>Admission</th>
                {subjects.map((s) => (
                  <th key={s} className="mono-col">
                    {s}
                  </th>
                ))}
                <th className="mono-col">Total</th>
                <th className="mono-col">%</th>
                <th>Grade</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const { total, maxTotal, percentage } = computeTotals(s.marks);
                const grade = gradeFor(percentage);
                return (
                  <tr id={`row-${s.id}`} key={s.id} className={selectedId === s.id ? "row-selected" : ""}>
                    <td className="mono-col">{s.rollNo}</td>
                    <td className="name-col">
                      <div className="name-cell">
                        <span>{s.name}</span>
                        {(s.guardianName || s.motherName) && (
                          <span className="sub-cell">
                            {[s.guardianName, s.motherName].filter(Boolean).join(" · ")}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{s.studentClass}</td>
                    <td>{s.gender || "—"}</td>
                    <td>{s.casteCategory || "—"}</td>
                    <td>{s.village || "—"}</td>
                    <td className="mono-col">{s.scholarNumber || "—"}</td>
                    <td className="mono-col">{s.admissionDate || "—"}</td>
                    {subjects.map((subj) => (
                      <td key={subj} className="mono-col">
                        {s.marks?.[subj] ?? "—"}
                      </td>
                    ))}
                    <td className="mono-col">
                      {total}/{maxTotal}
                    </td>
                    <td className="mono-col">{percentage}%</td>
                    <td>
                      <span className={`grade-pill grade-pill-${grade.charAt(0)}`}>{grade}</span>
                    </td>
                    <td className="actions-col">
                      <button className="row-btn" onClick={() => onEdit(s.id)}>
                        Edit
                      </button>
                      {confirmDeleteId === s.id ? (
                        <span className="confirm-inline">
                          <button
                            className="row-btn row-btn-danger"
                            onClick={() => {
                              onDelete(s.id);
                              setConfirmDeleteId(null);
                            }}
                          >
                            Confirm
                          </button>
                          <button className="row-btn" onClick={() => setConfirmDeleteId(null)}>
                            No
                          </button>
                        </span>
                      ) : (
                        <button className="row-btn row-btn-danger" onClick={() => setConfirmDeleteId(s.id)}>
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

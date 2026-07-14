import { useMemo, useState } from "react";
import { computeTotals, gradeFor } from "../utils/marks";
import "./Sidebar.css";

export default function Sidebar({ students, selectedId, onSelect, onNew }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.rollNo?.toLowerCase().includes(q) ||
        s.studentClass?.toLowerCase().includes(q) ||
        s.scholarNumber?.toLowerCase().includes(q)
    );
  }, [students, query]);

  return (
    <aside className="sidebar scrollbar-thin">
      <div className="sidebar-header">
        <div className="sidebar-crest">SR</div>
        <div>
          <p className="sidebar-eyebrow">Ledger</p>
          <p className="sidebar-title">Registered Students</p>
        </div>
      </div>

      <button className="sidebar-new-btn" onClick={onNew}>
        + New Student
      </button>

      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Search name, roll, class..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="sidebar-list">
        {filtered.length === 0 && (
          <p className="sidebar-empty">
            {students.length === 0
              ? "No students registered yet. Add the first entry to start the ledger."
              : "No matches for that search."}
          </p>
        )}

        {filtered.map((s, idx) => {
          const { percentage } = computeTotals(s.marks);
          const grade = gradeFor(percentage);
          return (
            <button
              key={s.id}
              className={`sidebar-item ${selectedId === s.id ? "active" : ""}`}
              onClick={() => onSelect(s.id)}
            >
              <span className="sidebar-item-index">{String(idx + 1).padStart(2, "0")}</span>
              <span className="sidebar-item-body">
                <span className="sidebar-item-name">{s.name}</span>
                <span className="sidebar-item-meta">
                  Roll {s.rollNo} &middot; Class {s.studentClass}
                </span>
              </span>
              <span className={`sidebar-item-grade grade-${grade.charAt(0)}`}>{grade}</span>
            </button>
          );
        })}
      </div>

      <div className="sidebar-footer">
        <span>{students.length} total</span>
      </div>
    </aside>
  );
}

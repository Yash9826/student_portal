import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import RegistrationForm from "./components/RegistrationForm";
import RecordsPanel from "./components/RecordsPanel";
import SetupNotice from "./components/SetupNotice";
import {
  loadStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  loadSubjects,
  addSubject,
  removeSubject,
} from "./utils/storage";
import { isSupabaseConfigured } from "./utils/supabaseClient";
import "./App.css";

export default function App() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [activeTab, setActiveTab] = useState("register"); // register | records
  const [editingId, setEditingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const refresh = useCallback(async () => {
    setLoadError(null);
    try {
      const [s, subj] = await Promise.all([loadStudents(), loadSubjects()]);
      setStudents(s);
      setSubjects(subj);
    } catch (err) {
      setLoadError(err.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const editingStudent = useMemo(
    () => students.find((s) => s.id === editingId) || null,
    [students, editingId]
  );

  async function handleSave(studentData) {
    try {
      if (editingId) {
        const updated = await updateStudent(editingId, studentData);
        setStudents(updated);
        setToast({ type: "ok", msg: `${studentData.name}'s record was updated.` });
        setEditingId(null);
      } else {
        const updated = await addStudent(studentData);
        setStudents(updated);
        setToast({ type: "ok", msg: `${studentData.name} was added to the register.` });
      }
      setActiveTab("records");
      setSelectedId(null);
    } catch (err) {
      setToast({ type: "warn", msg: err.message || "Could not save. Check your connection." });
    }
  }

  async function handleDelete(id) {
    const student = students.find((s) => s.id === id);
    try {
      const updated = await deleteStudent(id);
      setStudents(updated);
      setToast({ type: "warn", msg: `${student?.name || "Student"} was removed.` });
      if (selectedId === id) setSelectedId(null);
      if (editingId === id) setEditingId(null);
    } catch (err) {
      setToast({ type: "warn", msg: err.message || "Could not delete that record." });
    }
  }

  function handleEdit(id) {
    setEditingId(id);
    setActiveTab("register");
  }

  async function handleAddSubject(subject) {
    if (!subject.trim()) return;
    if (subjects.includes(subject.trim())) return;
    try {
      const next = await addSubject(subject.trim(), subjects);
      setSubjects(next);
    } catch (err) {
      setToast({ type: "warn", msg: err.message || "Could not add subject." });
    }
  }

  async function handleRemoveSubject(subject) {
    try {
      const next = await removeSubject(subject);
      setSubjects(next);
    } catch (err) {
      setToast({ type: "warn", msg: err.message || "Could not remove subject." });
    }
  }

  // if (!isSupabaseConfigured) {
  //   return <SetupNotice />;
  // }

  if (loading) {
    return (
      <div className="loading-screen">
        <p>Loading the register…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="loading-screen">
        <p className="loading-error">Couldn't load data: {loadError}</p>
        <button className="btn-primary" onClick={refresh}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar
        students={students}
        selectedId={selectedId}
        onSelect={(id) => {
          setSelectedId(id);
          setActiveTab("records");
        }}
        onNew={() => {
          setEditingId(null);
          setActiveTab("register");
        }}
      />

      <div className="main-column">
        <header className="topbar">
          <div className="topbar-title">
            <span className="topbar-eyebrow">Class Register &middot; Synced</span>
            <h1>Student Marks Portal</h1>
          </div>
          <nav className="tab-switch" aria-label="Sections">
            <button
              className={activeTab === "register" ? "tab active" : "tab"}
              onClick={() => setActiveTab("register")}
            >
              {editingId ? "Edit Entry" : "New Registration"}
            </button>
            <button
              className={activeTab === "records" ? "tab active" : "tab"}
              onClick={() => setActiveTab("records")}
            >
              All Records
              <span className="tab-count">{students.length}</span>
            </button>
          </nav>
        </header>

        <main className="content-area scrollbar-thin">
          {activeTab === "register" ? (
            <RegistrationForm
              key={editingId || "new"}
              subjects={subjects}
              onAddSubject={handleAddSubject}
              onRemoveSubject={handleRemoveSubject}
              initialData={editingStudent}
              onSave={handleSave}
              onCancelEdit={() => {
                setEditingId(null);
              }}
            />
          ) : (
            <RecordsPanel
              students={students}
              subjects={subjects}
              selectedId={selectedId}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </main>
      </div>

      {toast && (
        <div className={`toast toast-${toast.type}`} role="status">
          {toast.msg}
        </div>
      )}
    </div>
  );
}

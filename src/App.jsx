import { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import RegistrationForm from "./components/RegistrationForm";
import RecordsPanel from "./components/RecordsPanel";
import {
  loadStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  loadSubjects,
  saveSubjects,
} from "./utils/storage";
import "./App.css";

export default function App() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [activeTab, setActiveTab] = useState("register"); // register | records
  const [editingId, setEditingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setStudents(loadStudents());
    setSubjects(loadSubjects());
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const editingStudent = useMemo(
    () => students.find((s) => s.id === editingId) || null,
    [students, editingId]
  );

  function handleSave(studentData) {
    if (editingId) {
      const updated = updateStudent(editingId, studentData);
      setStudents(updated);
      setToast({ type: "ok", msg: `${studentData.name}'s record was updated.` });
      setEditingId(null);
    } else {
      const updated = addStudent(studentData);
      setStudents(updated);
      setToast({ type: "ok", msg: `${studentData.name} was added to the register.` });
    }
    setActiveTab("records");
    setSelectedId(null);
  }

  function handleDelete(id) {
    const student = students.find((s) => s.id === id);
    const updated = deleteStudent(id);
    setStudents(updated);
    setToast({ type: "warn", msg: `${student?.name || "Student"} was removed.` });
    if (selectedId === id) setSelectedId(null);
    if (editingId === id) setEditingId(null);
  }

  function handleEdit(id) {
    setEditingId(id);
    setActiveTab("register");
  }

  function handleAddSubject(subject) {
    if (!subject.trim()) return;
    const next = [...new Set([...subjects, subject.trim()])];
    setSubjects(next);
    saveSubjects(next);
  }

  function handleRemoveSubject(subject) {
    const next = subjects.filter((s) => s !== subject);
    setSubjects(next);
    saveSubjects(next);
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
            <span className="topbar-eyebrow">Class Register</span>
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

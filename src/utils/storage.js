const STORAGE_KEY = "register_students_v1";
const SUBJECTS_KEY = "register_subjects_v1";
const DEFAULT_SUBJECTS = ["Mathematics", "Science", "English", "Social Studies", "Computer"];

export function loadSubjects() {
  try {
    const raw = localStorage.getItem(SUBJECTS_KEY);
    if (!raw) return DEFAULT_SUBJECTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_SUBJECTS;
  } catch {
    return DEFAULT_SUBJECTS;
  }
}

export function saveSubjects(subjects) {
  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
}

export function loadStudents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStudents(students) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

export function addStudent(student) {
  const students = loadStudents();
  const withId = { ...student, id: crypto.randomUUID(), registeredAt: new Date().toISOString() };
  const updated = [withId, ...students];
  saveStudents(updated);
  return updated;
}

export function updateStudent(id, patch) {
  const students = loadStudents();
  const updated = students.map((s) => (s.id === id ? { ...s, ...patch } : s));
  saveStudents(updated);
  return updated;
}

export function deleteStudent(id) {
  const students = loadStudents();
  const updated = students.filter((s) => s.id !== id);
  saveStudents(updated);
  return updated;
}

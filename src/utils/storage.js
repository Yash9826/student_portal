import { supabase, isSupabaseConfigured } from "./supabaseClient";

const DEFAULT_SUBJECTS = ["Mathematics", "Science", "English", "Social Studies", "Computer"];

// ---- mapping helpers: DB (snake_case) <-> app (camelCase) ----

function rowToStudent(row) {
  return {
    id: row.id,
    name: row.name,
    rollNo: row.roll_no,
    studentClass: row.student_class,
    gender: row.gender || "",
    dob: row.dob || "",
    guardianName: row.guardian_name || "",
    motherName: row.mother_name || "",
    casteCategory: row.caste_category || "",
    village: row.village || "",
    scholarNumber: row.scholar_number || "",
    admissionDate: row.admission_date || "",
    contact: row.contact || "",
    marks: row.marks || {},
    registeredAt: row.registered_at,
  };
}

function studentToRow(student) {
  return {
    name: student.name,
    roll_no: student.rollNo,
    student_class: student.studentClass,
    gender: student.gender || null,
    dob: student.dob || null,
    guardian_name: student.guardianName || null,
    mother_name: student.motherName || null,
    caste_category: student.casteCategory || null,
    village: student.village || null,
    scholar_number: student.scholarNumber || null,
    admission_date: student.admissionDate || null,
    contact: student.contact || null,
    marks: student.marks || {},
  };
}

function requireSupabase() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY " +
        "to a .env file — see README.md."
    );
  }
}

// ---- students ----

export async function loadStudents() {
  requireSupabase();
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("registered_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(rowToStudent);
}

export async function addStudent(student) {
  requireSupabase();
  const { error } = await supabase.from("students").insert(studentToRow(student));
  if (error) throw error;
  return loadStudents();
}

export async function updateStudent(id, patch) {
  requireSupabase();
  const { error } = await supabase.from("students").update(studentToRow(patch)).eq("id", id);
  if (error) throw error;
  return loadStudents();
}

export async function deleteStudent(id) {
  requireSupabase();
  const { error } = await supabase.from("students").delete().eq("id", id);
  if (error) throw error;
  return loadStudents();
}

// ---- subjects ----

export async function loadSubjects() {
  requireSupabase();
  const { data, error } = await supabase.from("subjects").select("*").order("sort_order", { ascending: true });
  if (error) throw error;
  if (!data || data.length === 0) return DEFAULT_SUBJECTS;
  return data.map((row) => row.name);
}

export async function addSubject(name, currentSubjects) {
  requireSupabase();
  const nextOrder = currentSubjects.length + 1;
  const { error } = await supabase.from("subjects").insert({ name, sort_order: nextOrder });
  if (error) throw error;
  return loadSubjects();
}

export async function removeSubject(name) {
  requireSupabase();
  const { error } = await supabase.from("subjects").delete().eq("name", name);
  if (error) throw error;
  return loadSubjects();
}

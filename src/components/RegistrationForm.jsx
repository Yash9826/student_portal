import { useState } from "react";
import { computeTotals, gradeFor } from "../utils/marks";
import { CLASS_OPTIONS, CASTE_OPTIONS, GENDER_OPTIONS } from "../utils/constants";
import "./RegistrationForm.css";

const emptyDetails = {
  name: "",
  rollNo: "",
  studentClass: "",
  gender: "",
  dob: "",
  guardianName: "",
  motherName: "",
  casteCategory: "",
  village: "",
  scholarNumber: "",
  admissionDate: "",
  contact: "",
};

export default function RegistrationForm({
  subjects,
  onAddSubject,
  onRemoveSubject,
  initialData,
  onSave,
  onCancelEdit,
}) {
  const [details, setDetails] = useState(() =>
    initialData
      ? {
          name: initialData.name || "",
          rollNo: initialData.rollNo || "",
          studentClass: initialData.studentClass || "",
          gender: initialData.gender || "",
          dob: initialData.dob || "",
          guardianName: initialData.guardianName || "",
          motherName: initialData.motherName || "",
          casteCategory: initialData.casteCategory || "",
          village: initialData.village || "",
          scholarNumber: initialData.scholarNumber || "",
          admissionDate: initialData.admissionDate || "",
          contact: initialData.contact || "",
        }
      : emptyDetails
  );
  const [marks, setMarks] = useState(() => initialData?.marks || {});
  const [newSubject, setNewSubject] = useState("");
  const [errors, setErrors] = useState({});

  const { total, maxTotal, percentage } = computeTotals(marks);
  const grade = gradeFor(percentage);

  function updateField(field, value) {
    setDetails((d) => ({ ...d, [field]: value }));
  }

  function updateMark(subject, value) {
    const num = value === "" ? "" : Math.max(0, Math.min(100, Number(value)));
    setMarks((m) => ({ ...m, [subject]: num }));
  }

  function validate() {
    const next = {};
    if (!details.name.trim()) next.name = "Enter the student's name.";
    if (!details.rollNo.trim()) next.rollNo = "Enter a roll number.";
    if (!details.studentClass.trim()) next.studentClass = "Select a class.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSave({ ...details, marks });
    if (!initialData) {
      setDetails(emptyDetails);
      setMarks({});
    }
  }

  function handleAddSubject() {
    if (!newSubject.trim()) return;
    onAddSubject(newSubject.trim());
    setNewSubject("");
  }

  return (
    <form className="reg-form" onSubmit={handleSubmit}>
      <div className="reg-grid">
        <section className="reg-card">
          <h2 className="reg-card-title">Student Details</h2>

          <div className="field-row two">
            <Field label="Full Name" error={errors.name}>
              <input
                value={details.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g. Ananya Sharma"
              />
            </Field>
            <Field label="Roll Number" error={errors.rollNo}>
              <input
                value={details.rollNo}
                onChange={(e) => updateField("rollNo", e.target.value)}
                placeholder="e.g. 24"
              />
            </Field>
          </div>

          <div className="field-row two">
            <Field label="Class" error={errors.studentClass}>
              <select
                value={details.studentClass}
                onChange={(e) => updateField("studentClass", e.target.value)}
              >
                <option value="">Select class</option>
                {CLASS_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    Class {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Gender">
              <select value={details.gender} onChange={(e) => updateField("gender", e.target.value)}>
                <option value="">Select</option>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="field-row two">
            <Field label="Date of Birth">
              <input
                type="date"
                value={details.dob}
                onChange={(e) => updateField("dob", e.target.value)}
              />
            </Field>
            <Field label="Date of Admission">
              <input
                type="date"
                value={details.admissionDate}
                onChange={(e) => updateField("admissionDate", e.target.value)}
              />
            </Field>
          </div>

          <div className="field-row two">
            <Field label="Guardian / Father Name">
              <input
                value={details.guardianName}
                onChange={(e) => updateField("guardianName", e.target.value)}
                placeholder="Father / guardian"
              />
            </Field>
            <Field label="Mother Name">
              <input
                value={details.motherName}
                onChange={(e) => updateField("motherName", e.target.value)}
                placeholder="Mother's name"
              />
            </Field>
          </div>

          <div className="field-row two">
            <Field label="Category">
              <select
                value={details.casteCategory}
                onChange={(e) => updateField("casteCategory", e.target.value)}
              >
                <option value="">Select</option>
                {CASTE_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Village">
              <input
                value={details.village}
                onChange={(e) => updateField("village", e.target.value)}
                placeholder="e.g. Rampur"
              />
            </Field>
          </div>

          <div className="field-row two">
            <Field label="Scholar Number">
              <input
                value={details.scholarNumber}
                onChange={(e) => updateField("scholarNumber", e.target.value)}
                placeholder="e.g. SCH-1024"
              />
            </Field>
            <Field label="Contact Number">
              <input
                value={details.contact}
                onChange={(e) => updateField("contact", e.target.value)}
                placeholder="10-digit phone number"
              />
            </Field>
          </div>
        </section>

        {/* <section className="reg-card">
          <div className="reg-card-heading-row">
            <h2 className="reg-card-title">Marks by Subject</h2>
            <span className="reg-card-hint">Out of 100 each</span>
          </div>

          <div className="marks-grid">
            {subjects.map((subject) => (
              <div className="mark-item" key={subject}>
                <label>{subject}</label>
                <div className="mark-input-wrap">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={marks[subject] ?? ""}
                    onChange={(e) => updateMark(subject, e.target.value)}
                    placeholder="--"
                  />
                  <button
                    type="button"
                    className="mark-remove"
                    title={`Remove ${subject}`}
                    onClick={() => onRemoveSubject(subject)}
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="add-subject-row">
            <input
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Add another subject..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSubject();
                }
              }}
            />
            <button type="button" onClick={handleAddSubject}>
              Add
            </button>
          </div>

          <div className="summary-strip">
            <div>
              <span className="summary-label">Total</span>
              <span className="summary-value">
                {total} / {maxTotal}
              </span>
            </div>
            <div>
              <span className="summary-label">Percentage</span>
              <span className="summary-value">{percentage}%</span>
            </div>
            <div>
              <span className="summary-label">Grade</span>
              <span className={`summary-grade grade-pill-${grade.charAt(0)}`}>{grade}</span>
            </div>
          </div>
        </section> */}
      </div>

      <div className="reg-actions">
        {initialData && (
          <button type="button" className="btn-ghost" onClick={onCancelEdit}>
            Cancel Edit
          </button>
        )}
        <button type="submit" className="btn-primary">
          {initialData ? "Save Changes" : "Save Student"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}

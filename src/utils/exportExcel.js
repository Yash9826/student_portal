import * as XLSX from "xlsx";
import { computeTotals, gradeFor } from "./marks";

export function exportStudentsToExcel(students, subjectList, filename = "students-register.xlsx") {
  const rows = students.map((s) => {
    const { total, maxTotal, percentage } = computeTotals(s.marks);
    const row = {
      "Roll No": s.rollNo,
      Name: s.name,
      Class: s.studentClass,
      Section: s.section,
      Gender: s.gender,
      "Date of Birth": s.dob || "",
      "Guardian Name": s.guardianName || "",
      Contact: s.contact || "",
    };
    subjectList.forEach((subj) => {
      row[subj] = s.marks?.[subj] ?? "";
    });
    row["Total"] = `${total}/${maxTotal}`;
    row["Percentage"] = `${percentage}%`;
    row["Grade"] = gradeFor(percentage);
    row["Registered On"] = s.registeredAt ? new Date(s.registeredAt).toLocaleDateString() : "";
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);

  const colWidths = Object.keys(rows[0] || { "No data": "" }).map((key) => ({
    wch: Math.max(key.length + 2, 12),
  }));
  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
  XLSX.writeFile(workbook, filename);
}

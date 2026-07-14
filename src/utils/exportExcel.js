import XLSX from "xlsx-js-style";
import { computeTotals, gradeFor } from "./marks";

const HEADER_GROUPS = [
  { keys: ["Roll No", "Name", "Class", "Gender"], color: "2563EB" }, // blue - identity
  {
    keys: [
      "Category",
      "Village",
      "Scholar No",
      "Admission Date",
      "Guardian Name",
      "Mother Name",
      "Date of Birth",
      "Contact",
    ],
    color: "0D9488", // teal - background details
  },
  { color: "D97706", isSubject: true }, // amber - subject marks (matched dynamically)
  { keys: ["Total", "Percentage", "Grade"], color: "059669" }, // green - summary
  { keys: ["Registered On"], color: "6B7280" }, // gray - meta
];

function colorForHeader(header, subjectSet) {
  if (subjectSet.has(header)) return "D97706";
  for (const group of HEADER_GROUPS) {
    if (group.keys && group.keys.includes(header)) return group.color;
  }
  return "374151";
}

/**
 * Exports exactly the students passed in (i.e. whatever is currently
 * filtered in the UI) — not the full unfiltered list.
 */
export function exportStudentsToExcel(students, subjectList, filename = "students-register.xlsx") {
  const headers = [
    "Roll No",
    "Name",
    "Class",
    "Gender",
    "Category",
    "Village",
    "Scholar No",
    "Admission Date",
    "Guardian Name",
    "Mother Name",
    "Date of Birth",
    "Contact",
    ...subjectList,
    "Total",
    "Percentage",
    "Grade",
    "Registered On",
  ];

  const rows = students.map((s) => {
    const { total, maxTotal, percentage } = computeTotals(s.marks);
    const grade = gradeFor(percentage);
    return [
      s.rollNo || "",
      s.name || "",
      s.studentClass || "",
      s.gender || "",
      s.casteCategory || "",
      s.village || "",
      s.scholarNumber || "",
      s.admissionDate || "",
      s.guardianName || "",
      s.motherName || "",
      s.dob || "",
      s.contact || "",
      ...subjectList.map((subj) => s.marks?.[subj] ?? ""),
      `${total}/${maxTotal}`,
      `${percentage}%`,
      grade,
      s.registeredAt ? new Date(s.registeredAt).toLocaleDateString() : "",
    ];
  });

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const subjectSet = new Set(subjectList);

  // Style the header row: bold white text on a colored fill, per column group
  headers.forEach((header, colIdx) => {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIdx });
    if (!worksheet[cellRef]) return;
    worksheet[cellRef].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: colorForHeader(header, subjectSet) } },
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      border: {
        top: { style: "thin", color: { rgb: "FFFFFF" } },
        bottom: { style: "thin", color: { rgb: "FFFFFF" } },
        left: { style: "thin", color: { rgb: "FFFFFF" } },
        right: { style: "thin", color: { rgb: "FFFFFF" } },
      },
    };
  });

  worksheet["!cols"] = headers.map((h) => ({ wch: Math.max(h.length + 2, 12) }));
  worksheet["!rows"] = [{ hpx: 30 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
  XLSX.writeFile(workbook, filename);
}

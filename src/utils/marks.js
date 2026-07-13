export function computeTotals(marks) {
  const subjects = Object.keys(marks || {});
  const total = subjects.reduce((sum, key) => sum + (Number(marks[key]) || 0), 0);
  const maxTotal = subjects.length * 100;
  const percentage = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
  return { total, maxTotal, percentage: Math.round(percentage * 100) / 100 };
}

export function gradeFor(percentage) {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 40) return "D";
  return "F";
}

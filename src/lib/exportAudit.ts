import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function toCSV(rows: Record<string, any>[], columns: string[]): string {
  const escape = (v: any) => {
    if (v === null || v === undefined) return "";
    const s = typeof v === "object" ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = columns.join(",");
  const body = rows.map((r) => columns.map((c) => escape(r[c])).join(",")).join("\n");
  return `${header}\n${body}`;
}

function download(filename: string, content: string | Blob, mime = "text/csv;charset=utf-8;") {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

export function exportCSV(name: string, rows: Record<string, any>[], columns: string[]) {
  download(`${name}-${timestamp()}.csv`, toCSV(rows, columns));
}

export function exportPDF(
  title: string,
  name: string,
  rows: Record<string, any>[],
  columns: { key: string; header: string }[]
) {
  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(14);
  doc.text(title, 14, 15);
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`Generated: ${new Date().toLocaleString()}  •  ${rows.length} records`, 14, 21);
  autoTable(doc, {
    startY: 26,
    head: [columns.map((c) => c.header)],
    body: rows.map((r) =>
      columns.map((c) => {
        const v = r[c.key];
        if (v === null || v === undefined) return "";
        return typeof v === "object" ? JSON.stringify(v) : String(v);
      })
    ),
    styles: { fontSize: 7, cellPadding: 2, overflow: "linebreak" },
    headStyles: { fillColor: [30, 41, 59] },
    theme: "striped",
  });
  doc.save(`${name}-${timestamp()}.pdf`);
}
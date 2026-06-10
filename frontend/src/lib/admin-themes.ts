export type AdminSection = "dashboard" | "medical" | "adoption";

export interface AdminTheme {
  // page background (CSS color value, used by loading overlay too)
  loadingBg: string;
  // tailwind classes for the table page wrapper
  pageBg: string;
  pageText: string;
  headingText: string;
  surface: string; // table/card background
  surfaceBorder: string;
  inputBg: string;
  inputBorder: string;
  inputFocus: string;
  mutedText: string;
  hoverRow: string;
  primaryBtn: string;
  primaryBtnText: string;
  ghostBtnBorder: string;
  ghostBtnHover: string;
  modalBg: string;
  modalBorder: string;
  modalText: string;
  tableHeadBg: string;
  tableHeadText: string;
  rowBorder: string;
}

export const ADMIN_THEMES: Record<AdminSection, AdminTheme> = {
  dashboard: {
    loadingBg: "#020617", // slate-950
    pageBg: "bg-gradient-to-br from-slate-950 to-indigo-950",
    pageText: "text-slate-100",
    headingText: "text-slate-100",
    surface: "bg-slate-900",
    surfaceBorder: "border-slate-800",
    inputBg: "bg-slate-900",
    inputBorder: "border-slate-700",
    inputFocus: "focus:border-violet-400",
    mutedText: "text-slate-400",
    hoverRow: "hover:bg-slate-900/50",
    primaryBtn: "bg-violet-500 hover:bg-violet-400",
    primaryBtnText: "text-white",
    ghostBtnBorder: "border-slate-700",
    ghostBtnHover: "hover:bg-slate-800",
    modalBg: "bg-slate-900",
    modalBorder: "border-slate-700",
    modalText: "text-slate-100",
    tableHeadBg: "bg-slate-900/80",
    tableHeadText: "text-slate-400",
    rowBorder: "border-slate-800",
  },
  medical: {
    loadingBg: "#f0f9ff", // sky-50
    pageBg: "bg-gradient-to-br from-sky-50 to-sky-100",
    pageText: "text-sky-950",
    headingText: "text-sky-900",
    surface: "bg-white/80",
    surfaceBorder: "border-sky-200",
    inputBg: "bg-white",
    inputBorder: "border-sky-300",
    inputFocus: "focus:border-sky-500",
    mutedText: "text-sky-700",
    hoverRow: "hover:bg-sky-50",
    primaryBtn: "bg-sky-500 hover:bg-sky-400",
    primaryBtnText: "text-white",
    ghostBtnBorder: "border-sky-300",
    ghostBtnHover: "hover:bg-sky-100",
    modalBg: "bg-white",
    modalBorder: "border-sky-200",
    modalText: "text-sky-950",
    tableHeadBg: "bg-sky-100/80",
    tableHeadText: "text-sky-700",
    rowBorder: "border-sky-100",
  },
  adoption: {
    loadingBg: "#fdf6ec",
    pageBg: "bg-gradient-to-br from-[#fdf6ec] to-[#e9d5b4]",
    pageText: "text-amber-950",
    headingText: "text-amber-900",
    surface: "bg-white/80",
    surfaceBorder: "border-amber-200",
    inputBg: "bg-white",
    inputBorder: "border-amber-300",
    inputFocus: "focus:border-amber-500",
    mutedText: "text-amber-700",
    hoverRow: "hover:bg-amber-50",
    primaryBtn: "bg-amber-500 hover:bg-amber-400",
    primaryBtnText: "text-white",
    ghostBtnBorder: "border-amber-300",
    ghostBtnHover: "hover:bg-amber-100",
    modalBg: "bg-white",
    modalBorder: "border-amber-200",
    modalText: "text-amber-950",
    tableHeadBg: "bg-amber-100/80",
    tableHeadText: "text-amber-800",
    rowBorder: "border-amber-100",
  },
};

export function sectionForTable(tableKey: string): AdminSection {
  if (tableKey === "vet-records" || tableKey === "intake-records") return "medical";
  if (tableKey === "adopters" || tableKey === "applications" || tableKey === "rehoming-applications") return "adoption";
  return "dashboard";
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/AdminLayout";
import { TABLES, type FieldDef, type TableDef } from "@/lib/table-schemas";
import { API_BASE, createRecord, deleteRecord, listAll, updateRecord } from "@/lib/api";
import { ADMIN_THEMES, sectionForTable, type AdminTheme } from "@/lib/admin-themes";

export const Route = createFileRoute("/admin/table/$table")({
  component: TablePage,
});

function backLinkFor(tableKey: string): "/admin" | "/admin/medical" | "/admin/adoption" {
  if (tableKey === "vet-records" || tableKey === "intake-records") return "/admin/medical";
  if (tableKey === "adopters" || tableKey === "applications" || tableKey === "rehoming-applications") return "/admin/adoption";
  return "/admin";
}

function fmt(v: any) {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}T/.test(v)) {
    try { return new Date(v).toLocaleString(); } catch { return v; }
  }
  return String(v);
}

function TablePage() {
  const { table } = Route.useParams();
  const navigate = useNavigate();
  const def = TABLES[table];
  const section = sectionForTable(table);
  const theme = ADMIN_THEMES[section];
  if (!def) {
    return (
      <AdminLayout section={section}>
        <div className="p-8">Unknown table: {table}</div>
      </AdminLayout>
    );
  }
  return <TableInner def={def} theme={theme} section={section} onBack={() => navigate({ to: backLinkFor(table) })} />;
}

function TableInner({
  def,
  theme,
  section,
  onBack,
}: {
  def: TableDef;
  theme: AdminTheme;
  section: "dashboard" | "medical" | "adoption";
  onBack: () => void;
}) {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: [def.endpoint], queryFn: () => listAll(def.endpoint) });

  const fkEndpoints = useMemo(
    () => Array.from(new Set(def.fields.filter((f) => f.type === "fk" && f.fkEndpoint).map((f) => f.fkEndpoint!))),
    [def],
  );
  const fkQueries = useQueries({
    queries: fkEndpoints.map((ep) => ({ queryKey: [ep], queryFn: () => listAll(ep) })),
  });
  const fkMap: Record<string, any[]> = {};
  fkEndpoints.forEach((ep, i) => (fkMap[ep] = fkQueries[i].data ?? []));

  const lookupName = (endpoint: string, id: string) => {
    const rec = fkMap[endpoint]?.find((r: any) => r.id === id);
    return rec?.name ?? rec?.applicant_name ?? id ?? "—";
  };

  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    let rows = data as any[];
    for (const [k, v] of Object.entries(filterValues)) {
      if (v && v !== "All") {
        rows = rows.filter((r) => String(r[k]) === v);
      }
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      rows = rows.filter((r) => Object.values(r).some((val) => String(val ?? "").toLowerCase().includes(s)));
    }
    return rows;
  }, [data, filterValues, search]);

  const filterOptions = (f: { field: string; options?: string[]; fromData?: boolean; fkEndpoint?: string }) => {
    if (f.fkEndpoint) {
      return (fkMap[f.fkEndpoint] ?? []).map((r: any) => ({ value: r.id, label: r.name ?? r.applicant_name ?? r.id }));
    }
    if (f.options) return f.options.map((o) => ({ value: o, label: o }));
    if (f.fromData) return Array.from(new Set((data as any[]).map((r) => String(r[f.field])).filter(Boolean))).sort().map((o) => ({ value: o, label: o }));
    return [];
  };

  const [modalState, setModalState] = useState<{ mode: "add" | "edit"; record?: any } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const createMut = useMutation({
    mutationFn: (body: any) => createRecord(def.endpoint, body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [def.endpoint] }); setModalState(null); },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, body }: any) => updateRecord(def.endpoint, id, body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [def.endpoint] }); setModalState(null); },
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteRecord(def.endpoint, id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [def.endpoint] }); setDeleteTarget(null); },
  });

  const [approveTarget, setApproveTarget] = useState<any | null>(null);
  const [rejectTarget, setRejectTarget] = useState<any | null>(null);

  const approveMut = useMutation({
    mutationFn: async (row: any) => {
      const res = await fetch(`${API_BASE}/${def.endpoint}/${row.id}/approve`, { method: "PATCH" });
      if (!res.ok) throw new Error(await res.text());
      return row;
    },
    onSuccess: (row) => {
      qc.invalidateQueries({ queryKey: [def.endpoint] });
      qc.invalidateQueries({ queryKey: ["animals"] });
      setApproveTarget(null);
      toast.success(`${row.animal_name ?? "Animal"} has been added to the shelter! 🐾`);
    },
    onError: () => toast.error("Something went wrong. Please try again."),
  });
  const rejectMut = useMutation({
    mutationFn: async (row: any) => {
      const res = await fetch(`${API_BASE}/${def.endpoint}/${row.id}/reject`, { method: "PATCH" });
      if (!res.ok) throw new Error(await res.text());
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [def.endpoint] });
      setRejectTarget(null);
    },
    onError: () => toast.error("Something went wrong. Please try again."),
  });

  const isRehoming = def.key === "rehoming-applications";

  const inputCls = `rounded-md border ${theme.inputBorder} ${theme.inputBg} px-3 py-2 text-sm outline-none ${theme.inputFocus} ${theme.pageText}`;

  return (
    <AdminLayout section={section}>
      <div className={`min-h-screen ${theme.pageBg} px-8 py-8 ${theme.pageText}`}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className={`grid h-9 w-9 place-items-center rounded-md border ${theme.ghostBtnBorder} ${theme.ghostBtnHover}`}>
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h1 className={`text-2xl font-bold ${theme.headingText}`}>{def.label}</h1>
          </div>
          <button
            onClick={() => setModalState({ mode: "add" })}
            className={`inline-flex items-center gap-2 rounded-md ${theme.primaryBtn} ${theme.primaryBtnText} px-4 py-2 text-sm font-semibold`}
          >
            <Plus className="h-4 w-4" /> Add New Record
          </button>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className={`w-64 ${inputCls}`}
          />
          {def.filters?.map((f) => (
            <select
              key={f.field}
              value={filterValues[f.field] ?? "All"}
              onChange={(e) => setFilterValues((s) => ({ ...s, [f.field]: e.target.value }))}
              className={inputCls}
            >
              <option value="All">All {f.label}</option>
              {filterOptions(f).map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          ))}
        </div>

        <div className={`overflow-x-auto rounded-lg border ${theme.surfaceBorder} ${theme.surface}`}>
          <table className="w-full text-sm">
            <thead className={`${theme.tableHeadBg} text-left text-xs uppercase tracking-wider ${theme.tableHeadText}`}>
              <tr>
                {def.fields.map((f) => (
                  <th key={f.key} className="px-3 py-2 font-medium">{f.label}</th>
                ))}
                <th className="px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={def.fields.length + 1} className={`px-3 py-8 text-center ${theme.mutedText}`}>Loading…</td></tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={def.fields.length + 1} className={`px-3 py-8 text-center ${theme.mutedText}`}>No records</td></tr>
              )}
              {filtered.map((row) => (
                <tr key={row.id} className={`border-t ${theme.rowBorder} ${theme.hoverRow}`}>
                  {def.fields.map((f) => (
                    <td key={f.key} className="px-3 py-2 align-top">
                      {f.key === "status"
                        ? <StatusBadge value={row[f.key]} />
                        : f.type === "fk" && f.fkEndpoint
                          ? lookupName(f.fkEndpoint, row[f.key])
                          : f.type === "image"
                            ? (row[f.key] ? <img src={row[f.key]} alt="" className="h-10 w-10 rounded object-cover" /> : "—")
                            : f.key === "id"
                              ? <span className={`text-xs ${theme.mutedText}`}>{String(row[f.key] ?? "").slice(0, 8)}…</span>
                              : fmt(row[f.key])}
                    </td>
                  ))}
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      {isRehoming && row.status === "pending" && (
                        <>
                          <button onClick={() => setApproveTarget(row)} className="grid h-8 w-8 place-items-center rounded border border-green-500/60 text-green-600 hover:bg-green-500/10" title="Approve">
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => setRejectTarget(row)} className="grid h-8 w-8 place-items-center rounded border border-red-400/60 text-red-500 hover:bg-red-500/10" title="Reject">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                      <button onClick={() => setModalState({ mode: "edit", record: row })} className={`grid h-8 w-8 place-items-center rounded border ${theme.ghostBtnBorder} ${theme.ghostBtnHover}`} title="Edit">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setDeleteTarget(row)} className="grid h-8 w-8 place-items-center rounded border border-red-400/60 text-red-500 hover:bg-red-500/10" title="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalState && (
        <RecordModal
          def={def}
          theme={theme}
          mode={modalState.mode}
          initial={modalState.record}
          fkMap={fkMap}
          onClose={() => setModalState(null)}
          onSubmit={(body) => {
            if (modalState.mode === "add") createMut.mutate(body);
            else updateMut.mutate({ id: modalState.record.id, body });
          }}
          submitting={createMut.isPending || updateMut.isPending}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          theme={theme}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => deleteMut.mutate(deleteTarget.id)}
          loading={deleteMut.isPending}
        />
      )}

      {approveTarget && (
        <ConfirmDialog
          theme={theme}
          title="Approve rehoming application?"
          message={`Approve this rehoming application? This will add ${approveTarget.animal_name ?? "this animal"} to the shelter's animals list and make them visible on the public website.`}
          confirmLabel="Approve"
          loadingLabel="Approving…"
          confirmClass="bg-green-600 hover:bg-green-500"
          onCancel={() => setApproveTarget(null)}
          onConfirm={() => approveMut.mutate(approveTarget)}
          loading={approveMut.isPending}
        />
      )}

      {rejectTarget && (
        <ConfirmDialog
          theme={theme}
          title="Reject rehoming application?"
          message="Reject this rehoming application?"
          confirmLabel="Reject"
          loadingLabel="Rejecting…"
          onCancel={() => setRejectTarget(null)}
          onConfirm={() => rejectMut.mutate(rejectTarget)}
          loading={rejectMut.isPending}
        />
      )}
    </AdminLayout>
  );
}

function RecordModal({
  def, theme, mode, initial, fkMap, onClose, onSubmit, submitting,
}: {
  def: TableDef; theme: AdminTheme; mode: "add" | "edit"; initial?: any; fkMap: Record<string, any[]>;
  onClose: () => void; onSubmit: (body: any) => void; submitting: boolean;
}) {
  const fields = def.fields.filter((f) => !f.hideInForm);
  const [values, setValues] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = {};
    fields.forEach((f) => {
      const v = initial?.[f.key];
      init[f.key] = v ?? (f.type === "boolean" ? false : "");
    });
    return init;
  });
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    for (const f of fields) {
      if (f.required && (values[f.key] === "" || values[f.key] == null)) {
        setErr(`${f.label} is required`);
        return;
      }
    }
    const body: any = {};
    fields.forEach((f) => {
      let v = values[f.key];
      if (v === "" || v == null) return;
      if (f.type === "number") v = Number(v);
      if (f.type === "boolean") v = Boolean(v);
      if (f.type === "datetime" && typeof v === "string" && v.length === 16) v = new Date(v).toISOString();
      body[f.key] = v;
    });
    onSubmit(body);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <form onSubmit={submit} className={`w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border ${theme.modalBorder} ${theme.modalBg} p-6 ${theme.modalText} shadow-2xl`}>
        <h3 className="mb-4 text-lg font-semibold">{mode === "add" ? `Add ${def.label}` : `Edit ${def.label}`}</h3>
        <div className="space-y-3">
          {fields.map((f) => (
            <FieldInput key={f.key} f={f} theme={theme} value={values[f.key]} onChange={(v) => setValues((s) => ({ ...s, [f.key]: v }))} fkMap={fkMap} />
          ))}
        </div>
        {err && <p className="mt-3 text-sm text-red-500">{err}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className={`rounded-md border ${theme.ghostBtnBorder} px-4 py-2 text-sm ${theme.ghostBtnHover}`}>Cancel</button>
          <button type="submit" disabled={submitting} className={`rounded-md ${theme.primaryBtn} ${theme.primaryBtnText} px-4 py-2 text-sm font-semibold disabled:opacity-50`}>
            {submitting ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

function FieldInput({ f, theme, value, onChange, fkMap }: { f: FieldDef; theme: AdminTheme; value: any; onChange: (v: any) => void; fkMap: Record<string, any[]> }) {
  const base = `w-full rounded-md border ${theme.inputBorder} ${theme.inputBg} px-3 py-2 text-sm outline-none ${theme.inputFocus} ${theme.modalText}`;
  return (
    <label className="block">
      <span className={`mb-1 block text-xs uppercase tracking-wider ${theme.mutedText}`}>{f.label}{f.required && " *"}</span>
      {f.type === "textarea" ? (
        <textarea className={base} rows={3} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      ) : f.type === "boolean" ? (
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" />
      ) : f.type === "number" ? (
        <input type="number" className={base} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      ) : f.type === "datetime" ? (
        <input
          type="datetime-local"
          className={base}
          value={value ? (typeof value === "string" && value.length > 16 ? value.slice(0, 16) : value) : ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : f.type === "select" ? (
        <select className={base} value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
          <option value="">— select —</option>
          {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : f.type === "fk" ? (
        <select className={base} value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
          <option value="">— select —</option>
          {(fkMap[f.fkEndpoint!] ?? []).map((r: any) => (
            <option key={r.id} value={r.id}>{r.name ?? r.applicant_name ?? r.id}</option>
          ))}
        </select>
      ) : f.type === "image" ? (
        <ImageDropInput value={value} onChange={onChange} theme={theme} />
      ) : (
        <input type="text" className={base} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function ImageDropInput({ value, onChange, theme }: { value: any; onChange: (v: string) => void; theme: AdminTheme }) {
  const [dragOver, setDragOver] = useState(false);
  const [err, setErr] = useState("");

  function handleFile(file: File) {
    setErr("");
    if (!file.type.startsWith("image/")) { setErr("Please drop an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { setErr("Image must be under 5MB"); return; }
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
        className={`relative flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 py-6 text-center text-sm transition ${dragOver ? "border-current opacity-90" : `${theme.inputBorder} ${theme.inputBg}`}`}
      >
        {value ? (
          <div className="flex w-full items-center gap-3">
            <img src={value} alt="preview" className="h-16 w-16 rounded object-cover" />
            <div className={`flex-1 truncate text-left text-xs ${theme.mutedText}`}>{String(value).startsWith("data:") ? "Uploaded image" : value}</div>
            <button type="button" onClick={() => onChange("")} className="text-xs text-red-500 hover:text-red-400">Remove</button>
          </div>
        ) : (
          <>
            <p className={theme.mutedText}>Drag &amp; drop an image here, or</p>
            <label className={`cursor-pointer rounded-md ${theme.primaryBtn} ${theme.primaryBtnText} px-3 py-1.5 text-xs font-semibold`}>
              Browse
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </label>
            <p className={`text-xs ${theme.mutedText}`}>PNG, JPG, GIF up to 5MB</p>
          </>
        )}
      </div>
      {err && <p className="mt-1 text-xs text-red-500">{err}</p>}
    </div>
  );
}

function ConfirmDialog({
  theme, onCancel, onConfirm, loading,
  title = "Delete record?",
  message = "Are you sure you want to delete this record? This cannot be undone.",
  confirmLabel = "Delete",
  loadingLabel = "Deleting…",
  confirmClass = "bg-red-500 hover:bg-red-400",
}: {
  theme: AdminTheme; onCancel: () => void; onConfirm: () => void; loading: boolean;
  title?: string; message?: string; confirmLabel?: string; loadingLabel?: string; confirmClass?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className={`w-full max-w-sm rounded-xl border ${theme.modalBorder} ${theme.modalBg} p-6 ${theme.modalText} shadow-2xl`}>
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className={`mb-5 text-sm ${theme.mutedText}`}>{message}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className={`rounded-md border ${theme.ghostBtnBorder} px-4 py-2 text-sm ${theme.ghostBtnHover}`}>Cancel</button>
          <button onClick={onConfirm} disabled={loading} className={`rounded-md ${confirmClass} px-4 py-2 text-sm font-semibold text-white disabled:opacity-50`}>
            {loading ? loadingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ value }: { value: any }) {
  const v = String(value ?? "").toLowerCase();
  const cls =
    v === "approved" ? "bg-green-100 text-green-800 border-green-300"
    : v === "rejected" ? "bg-red-100 text-red-800 border-red-300"
    : v === "pending" ? "bg-yellow-100 text-yellow-800 border-yellow-300"
    : "bg-slate-100 text-slate-700 border-slate-300";
  return <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${cls}`}>{v || "—"}</span>;
}

void Link;

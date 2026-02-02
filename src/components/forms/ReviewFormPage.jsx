import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useApi, useToast } from "../../hooks/hooks";
import { Icon } from "../common/Icon";

// ─────────────────────────────────────────────────────────────────────────────
// ADD / EDIT REVIEW
// ─────────────────────────────────────────────────────────────────────────────
export function ReviewFormPage({ params, navigate, isEdit }) {
  const api = useApi();
  const { user } = useContext(AuthContext);
  const { toast, showToast } = useToast();
  const [book, setBook] = useState(null);
  const [form, setForm] = useState({ rating: 0, comment: "", read_date: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const b = await api.get(`/books/${params.bookId}`);
        setBook(b.data);
        if (isEdit) {
          const r = await api.get(`/users/${user.id}/books/${params.bookId}/reviews`);
          if (r?.data) setForm({ rating: r.data.rating || 0, comment: r.data.comment || "", read_date: r.data.read_date || "" });
        }
      } catch {}
      setLoading(false);
    })();
  }, [params.bookId, isEdit]);

  const submit = async (e) => {
    e.preventDefault(); setError(""); setSaving(true);
    try {
      const payload = { comment: form.comment, read_date: form.read_date || null };
      if (form.rating) payload.rating = form.rating;
      if (isEdit) {
        await api.put(`/users/${user.id}/books/${params.bookId}/reviews`, payload);
        showToast("Valoración actualizada");
      } else {
        await api.post(`/users/${user.id}/books/${params.bookId}/reviews`, payload);
        showToast("Valoración añadida");
      }
      navigate("book-detail", { bookId: params.bookId });
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!book) return <div className="empty-state"><h4>Libro no encontrado</h4></div>;

  return (
    <div>
      {toast && <div className={`toast ${toast.type}`}><Icon name={toast.type === "success" ? "check" : "alert"} style={{ width: 18, height: 18 }} />{toast.msg}</div>}
      <button className="btn btn-ghost btn-sm" onClick={() => navigate("book-detail", { bookId: params.bookId })} style={{ marginBottom: 16 }}><Icon name="arrow-left" /> Volver</button>
      <div className="card" style={{ maxWidth: 600 }}>
        <div className="card-header">
          <h3>{isEdit ? "Editar valoración" : "Nueva valoración"}</h3>
        </div>
        <div className="card-body">
          <div style={{ marginBottom: 24, padding: "16px 20px", background: "var(--cream-dark)", borderRadius: 10 }}>
            <div style={{ fontSize: "0.7rem", color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Libro</div>
            <div style={{ fontSize: "1rem", fontFamily: "'Playfair Display', serif", color: "var(--ink)" }}>{book.title}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--ink-muted)", fontStyle: "italic" }}>{book.author}</div>
          </div>
          <form onSubmit={submit}>
            <div className="input-group">
              <label>Puntuación</label>
              <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button" onClick={() => setForm({ ...form, rating: form.rating === n ? 0 : n })}
                    style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid var(--border)", background: form.rating >= n ? "var(--gold)" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", color: form.rating >= n ? "#fff" : "var(--gold)" }}>
                    <Icon name="star" style={{ width: 18, height: 18, fill: form.rating >= n ? "#fff" : "none" }} />
                  </button>
                ))}
              </div>
            </div>
            <div className="input-group">
              <label>Comentario (opcional)</label>
              <textarea value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} placeholder="Escribe tus impresiones sobre este libro..." maxLength={1000} />
            </div>
            <div className="input-group">
              <label>Fecha de lectura (opcional)</label>
              <input type="date" value={form.read_date} onChange={e => setForm({ ...form, read_date: e.target.value })} />
            </div>
            {error && <div className="error-msg">{error}</div>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => navigate("book-detail", { bookId: params.bookId })}>Cancelar</button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                {saving ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : (isEdit ? "Guardar cambios" : "Añadir valoración")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

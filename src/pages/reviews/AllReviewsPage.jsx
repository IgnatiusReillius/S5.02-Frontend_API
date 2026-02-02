import { useState, useEffect, useCallback } from "react";
import { useApi, useToast } from "../../hooks/hooks";
import { Icon } from "../../components/common/Icon";
import { Stars } from "../../components/common/Stars";
import { ConfirmModal } from "../../components/common/ConfirmModal";

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN: ALL REVIEWS
// ─────────────────────────────────────────────────────────────────────────────
export function AllReviewsPage() {
  const api = useApi();
  const { toast, showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    try { const r = await api.get("/users/books/reviews"); setReviews(r?.data || []); } catch {}
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = reviews.filter(r =>
    (r.book_title || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.user_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (idUser, idBook) => {
    try { await api.del(`/users/${idUser}/books/${idBook}/reviews`); showToast("Valoración eliminada"); setConfirm(null); load(); }
    catch (e) { showToast(e.message, "error"); setConfirm(null); }
  };

  const handleDeleteAll = async () => {
    try { await api.del("/users/books/reviews"); showToast("Todas las valoraciones eliminadas"); setConfirm(null); load(); }
    catch (e) { showToast(e.message, "error"); setConfirm(null); }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      {toast && <div className={`toast ${toast.type}`}><Icon name={toast.type === "success" ? "check" : "alert"} style={{ width: 18, height: 18 }} />{toast.msg}</div>}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
          <Icon name="search" style={{ width: 16, height: 16, color: "var(--ink-muted)" }} />
          <input placeholder="Buscar por libro o usuario..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {reviews.length > 0 && <button className="btn btn-danger btn-sm" onClick={() => setConfirm({ type: "all" })}><Icon name="trash" /> Borrar todas</button>}
      </div>
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {filtered.length === 0 ? (
            <div className="empty-state"><Icon name="star" /><h4>No hay valoraciones</h4></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Libro</th><th>Autor libro</th><th>Usuario</th><th>Puntuación</th><th>Comentario</th><th>Fecha lectura</th><th></th></tr></thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={i}>
                      <td><strong>{r.book_title}</strong></td>
                      <td>{r.book_author}</td>
                      <td>{r.user_name}</td>
                      <td><Stars value={r.rating} /></td>
                      <td style={{ maxWidth: 160 }}>{r.comment || "—"}</td>
                      <td>{r.read_date || "—"}</td>
                      <td><button className="btn btn-danger btn-sm" onClick={() => setConfirm({ type: "one", idUser: r.id_user, idBook: r.id_book, title: r.book_title })}><Icon name="trash" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <ConfirmModal
        open={!!confirm}
        title={confirm?.type === "all" ? "Eliminar todas las valoraciones" : "Eliminar valoración"}
        message={confirm?.type === "all"
          ? "¿Estás seguro de que quieres eliminar todas las valoraciones del sistema?"
          : <>¿Eliminar la valoración de <strong>{confirm?.title}</strong>?</>}
        onConfirm={confirm?.type === "all" ? handleDeleteAll : () => handleDelete(confirm?.idUser, confirm?.idBook)}
        onClose={() => setConfirm(null)}
      />
    </div>
  );
}

import { useState, useEffect, useCallback, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useApi, useToast } from "../../hooks/hooks";
import { Icon } from "../../components/common/Icon";
import { Stars } from "../../components/common/Stars";
import { ConfirmModal } from "../../components/common/ConfirmModal";

// ─────────────────────────────────────────────────────────────────────────────
// MY REVIEWS
// ─────────────────────────────────────────────────────────────────────────────
export function MyReviewsPage({ navigate }) {
  const api = useApi();
  const { user } = useContext(AuthContext);
  const { toast, showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    try { const r = await api.get(`/users/${user.id}/reviews`); setReviews(r?.data || []); }
    catch {}
    setLoading(false);
  }, [user.id]);
  useEffect(() => { load(); }, [load]);

  const handleDelete = async (bookId) => {
    try {
      await api.del(`/users/${user.id}/books/${bookId}/reviews`);
      showToast("Valoración eliminada"); setConfirm(null); load();
    } catch (e) { showToast(e.message, "error"); setConfirm(null); }
  };

  const handleDeleteAll = async () => {
    try {
      await api.del(`/users/${user.id}/reviews`);
      showToast("Todas mis valoraciones eliminadas"); setConfirm(null); load();
    } catch (e) { showToast(e.message, "error"); setConfirm(null); }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      {toast && <div className={`toast ${toast.type}`}><Icon name={toast.type === "success" ? "check" : "alert"} style={{ width: 18, height: 18 }} />{toast.msg}</div>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontSize: "0.85rem", color: "var(--ink-muted)" }}>{reviews.length} valoración{reviews.length !== 1 ? "es" : ""}</span>
        {reviews.length > 0 && <button className="btn btn-danger btn-sm" onClick={() => setConfirm({ type: "all" })}><Icon name="trash" /> Borrar todas</button>}
      </div>
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {reviews.length === 0 ? (
            <div className="empty-state"><Icon name="star" /><h4>No tienes valoraciones</h4><p>Ve a la biblioteca y añade los libros que has leído.</p></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Libro</th><th>Autor</th><th>Puntuación</th><th>Comentario</th><th>Fecha lectura</th><th></th></tr></thead>
                <tbody>
                  {reviews.map((r, i) => (
                    <tr key={i}>
                      <td><strong style={{ cursor: "pointer", color: "var(--accent)" }} onClick={() => navigate("book-detail", { bookId: r.id_book })}>{r.book_title}</strong></td>
                      <td>{r.book_author}</td>
                      <td><Stars value={r.rating} /></td>
                      <td style={{ maxWidth: 180 }}>{r.comment || "—"}</td>
                      <td>{r.read_date || "—"}</td>
                      <td>
                        <div className="actions-cell">
                          <button className="btn btn-secondary btn-sm" onClick={() => navigate("edit-review", { bookId: r.id_book })}><Icon name="edit" /></button>
                          <button className="btn btn-danger btn-sm" onClick={() => setConfirm({ type: "one", bookId: r.id_book, title: r.book_title })}><Icon name="trash" /></button>
                        </div>
                      </td>
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
          ? "¿Estás seguro de que quieres eliminar todas tus valoraciones?"
          : <>¿Eliminar tu valoración de <strong>{confirm?.title}</strong>?</>}
        onConfirm={confirm?.type === "all" ? handleDeleteAll : () => handleDelete(confirm?.bookId)}
        onClose={() => setConfirm(null)}
      />
    </div>
  );
}

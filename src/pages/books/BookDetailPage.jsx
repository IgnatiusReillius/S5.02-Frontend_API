import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useApi, useToast } from "../../hooks/hooks";
import { Icon } from "../../components/common/Icon";
import { Stars } from "../../components/common/Stars";

// ─────────────────────────────────────────────────────────────────────────────
// BOOK DETAIL
// ─────────────────────────────────────────────────────────────────────────────
export function BookDetailPage({ params, navigate }) {
  const api = useApi();
  const { user } = useContext(AuthContext);
  const { toast, showToast } = useToast();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myReview, setMyReview] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const b = await api.get(`/books/${params.bookId}`);
        setBook(b.data);
        if (user.is_admin) {
          const r = await api.get(`/users/books/${params.bookId}/reviews`);
          setReviews(r?.data || []);
        }
        // Check if user has a review for this book
        try {
          const mr = await api.get(`/users/${user.id}/books/${params.bookId}/reviews`);
          if (mr?.data) setMyReview(mr.data);
        } catch {}
      } catch {}
      setLoading(false);
    })();
  }, [params.bookId]);

  const handleDeleteReview = async (idUser) => {
    try {
      await api.del(`/users/${idUser}/books/${params.bookId}/reviews`);
      showToast("Valoración eliminada");
      setReviews(prev => prev.filter(r => r.id_user !== idUser));
      if (idUser === user.id) setMyReview(null);
    } catch (e) { showToast(e.message, "error"); }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!book) return <div className="empty-state"><h4>Libro no encontrado</h4></div>;

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1) : null;

  return (
    <div>
      {toast && <div className={`toast ${toast.type}`}><Icon name={toast.type === "success" ? "check" : "alert"} style={{ width: 18, height: 18 }} />{toast.msg}</div>}
      <button className="btn btn-ghost btn-sm" onClick={() => navigate("books")} style={{ marginBottom: 16 }}><Icon name="arrow-left" /> Volver a libros</button>
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body">
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "flex-start" }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <h2 style={{ fontSize: "1.7rem", marginBottom: 4 }}>{book.title}</h2>
              <p style={{ color: "var(--ink-muted)", fontStyle: "italic", marginBottom: 16 }}>{book.author}</p>
              <p style={{ fontSize: 0.88 + "rem", color: "var(--ink-light)", lineHeight: 1.6 }}>{book.summary}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 200 }}>
              <div style={{ background: "var(--cream-dark)", borderRadius: 10, padding: "16px 20px" }}>
                <div style={{ fontSize: "0.7rem", color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>ISBN</div>
                <div style={{ fontSize: "0.85rem", color: "var(--ink)" }}>{book.isbn}</div>
              </div>
              <div style={{ background: "var(--cream-dark)", borderRadius: 10, padding: "16px 20px" }}>
                <div style={{ fontSize: "0.7rem", color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Editorial / Páginas</div>
                <div style={{ fontSize: "0.85rem", color: "var(--ink)" }}>{book.publisher} · {book.pages} pág.</div>
              </div>
              {avgRating && (
                <div style={{ background: "var(--gold-light)", borderRadius: 10, padding: "16px 20px" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Puntuación media</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: "var(--gold)" }}>{avgRating}</span>
                    <span style={{ fontSize: "0.78rem", color: "var(--ink-muted)" }}>/ 5</span>
                  </div>
                </div>
              )}
              {!user.is_admin && !myReview && (
                <button className="btn btn-primary btn-sm" onClick={() => navigate("add-review", { bookId: book.id })}>
                  <Icon name="star" /> Añadir valoración
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Reviews list — admin only */}
      {user.is_admin && (
        <div className="card">
          <div className="card-header"><h3>Valoraciones de este libro</h3></div>
          <div className="card-body" style={{ padding: 0 }}>
            {reviews.length === 0 ? (
              <div className="empty-state"><Icon name="star" /><h4>Sin valoraciones</h4></div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Usuario</th><th>Puntuación</th><th>Comentario</th><th>Fecha lectura</th><th></th></tr></thead>
                  <tbody>
                    {reviews.map((r, i) => (
                      <tr key={i}>
                        <td><strong>{r.user_name}</strong></td>
                        <td><Stars value={r.rating} /></td>
                        <td style={{ maxWidth: 200 }}>{r.comment || "—"}</td>
                        <td>{r.read_date || "—"}</td>
                        <td><button className="btn btn-danger btn-sm" onClick={() => handleDeleteReview(r.id_user)}><Icon name="trash" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
      {/* My review summary (non-admin) */}
      {!user.is_admin && myReview && (
        <div className="card">
          <div className="card-header"><h3>Mi valoración</h3></div>
          <div className="card-body">
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
              <div><Stars value={myReview.rating} /><p style={{ fontSize: "0.82rem", color: "var(--ink-light)", marginTop: 8 }}>{myReview.comment || "Sin comentario"}</p></div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate("edit-review", { bookId: book.id })}><Icon name="edit" /> Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteReview(user.id)}><Icon name="trash" /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

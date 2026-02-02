import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useApi } from "../../hooks/hooks";
import { Icon } from "../../components/common/Icon";
import { Stars } from "../../components/common/Stars";

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export function Dashboard({ navigate }) {
  const api = useApi();
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ books: 0, users: 0, myReviews: 0 });
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const booksRes = await api.get("/books");
        const books = booksRes?.data || [];
        let users = [];
        if (user.is_admin) { const u = await api.get("/users"); users = u?.data || []; }
        const reviewsRes = await api.get(`/users/${user.id}/reviews`);
        const reviews = reviewsRes?.data || [];
        setStats({ books: books.length, users: users.length, myReviews: reviews.length });
        setRecentReviews(reviews.slice(0, 5));
      } catch {}
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon si-blue"><Icon name="book" /></div>
          <div className="stat-val">{stats.books}</div>
          <div className="stat-label">Libros en biblioteca</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon si-amber"><Icon name="star" /></div>
          <div className="stat-val">{stats.myReviews}</div>
          <div className="stat-label">Mis valoraciones</div>
        </div>
        {user.is_admin && (
          <div className="stat-card">
            <div className="stat-icon si-rose"><Icon name="users" /></div>
            <div className="stat-val">{stats.users}</div>
            <div className="stat-label">Usuarios registrados</div>
          </div>
        )}
      </div>
      <div className="card">
        <div className="card-header">
          <h3>Valoraciones recientes</h3>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("myreviews")}>Ver todas</button>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {recentReviews.length === 0 ? (
            <div className="empty-state">
              <Icon name="star" />
              <h4>Sin valoraciones aún</h4>
              <p>Añade libros a tu perfil y deja tu valoración.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Libro</th><th>Autor</th><th>Puntuación</th><th>Fecha lectura</th></tr></thead>
                <tbody>
                  {recentReviews.map((r, i) => (
                    <tr key={i}>
                      <td><strong>{r.book_title}</strong></td>
                      <td>{r.book_author}</td>
                      <td><Stars value={r.rating} /></td>
                      <td>{r.read_date || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

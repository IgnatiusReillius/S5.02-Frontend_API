import { useState, useEffect, useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Icon } from "./components/common/Icon";
import { LoginPage } from "./pages/auth/LoginPage";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { BooksPage } from "./pages/books/BooksPage";
import { BookDetailPage } from "./pages/books/BookDetailPage";
import { ReviewFormPage } from "./components/forms/ReviewFormPage";
import { MyReviewsPage } from "./pages/reviews/MyReviewsPage";
import { UsersPage } from "./pages/users/UsersPage";
import { AllReviewsPage } from "./pages/reviews/AllReviewsPage";
import { GLOBAL_CSS } from "./styles/styles.js";

// ─────────────────────────────────────────────────────────────────────────────
// ROOT (with Logout wired properly)
// ─────────────────────────────────────────────────────────────────────────────
export function Root() {
  const { user, loading: authLoading, logout } = useContext(AuthContext);
  const [route, setRoute] = useState("dashboard");
  const [routeParams, setRouteParams] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const tag = document.createElement("style");
    tag.textContent = GLOBAL_CSS;
    document.head.appendChild(tag);
    return () => document.head.removeChild(tag);
  }, []);

  const navigate = (r, params = {}) => { setRoute(r); setRouteParams(params); };

  if (authLoading) return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div className="spinner" /></div>;
  if (!user) return <LoginPage />;

  const routeTitles = {
    dashboard: "Inicio",
    books: "Biblioteca",
    "book-detail": "Detalle del libro",
    "add-review": "Nueva valoración",
    "edit-review": "Editar valoración",
    myreviews: "Mis valoraciones",
    users: "Usuarios",
    allreviews: "Todas las valoraciones",
  };

  const renderPage = () => {
    switch (route) {
      case "dashboard": return <Dashboard navigate={navigate} />;
      case "books": return <BooksPage navigate={navigate} />;
      case "book-detail": return <BookDetailPage params={routeParams} navigate={navigate} />;
      case "add-review": return <ReviewFormPage params={routeParams} navigate={navigate} isEdit={false} />;
      case "edit-review": return <ReviewFormPage params={routeParams} navigate={navigate} isEdit={true} />;
      case "myreviews": return <MyReviewsPage navigate={navigate} />;
      case "users": return user.is_admin ? <UsersPage /> : <Dashboard navigate={navigate} />;
      case "allreviews": return user.is_admin ? <AllReviewsPage /> : <Dashboard navigate={navigate} />;
      default: return <Dashboard navigate={navigate} />;
    }
  };

  const navItems = [
    { id: "dashboard", label: "Inicio", icon: "home" },
    { id: "books", label: "Biblioteca", icon: "book" },
    { id: "myreviews", label: "Mis valoraciones", icon: "star" },
  ];
  if (user.is_admin) {
    navItems.push({ divider: true });
    navItems.push({ id: "users", label: "Usuarios", icon: "users" });
    navItems.push({ id: "allreviews", label: "Valoraciones", icon: "shield" });
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "" : "hidden"}`}>
        <div className="sidebar-logo">
          <h1>📖 Mi Biblioteca</h1>
          <p>Gestor personal</p>
        </div>
        <ul className="nav-list">
          {navItems.map((item, idx) => {
            if (item.divider) return <li key={"div-" + idx} className="divider" style={{ margin: "8px 4px" }} />;
            return (
              <li className="nav-item" key={item.id}>
                <button className={`nav-link ${route === item.id ? "active" : ""}`} onClick={() => navigate(item.id)}>
                  <Icon name={item.icon} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <div className="name">{user.name}</div>
              <div className="role">{user.is_admin ? "Administrador" : "Usuario"}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            <Icon name="logout" style={{ width: 14, height: 14 }} /> Cerrar sesión
          </button>
        </div>
      </aside>

      <main className={`main-content ${sidebarOpen ? "" : "expanded"}`}>
        <div className="top-bar">
          <div style={{ display: "flex", alignItems: "center" }}>
            <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}><Icon name="menu" /></button>
            <h2>{routeTitles[route] || "Biblioteca"}</h2>
          </div>
        </div>
        <div className="page-body">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
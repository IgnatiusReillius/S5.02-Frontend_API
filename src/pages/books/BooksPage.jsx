import { useState, useEffect, useCallback, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useApi, useToast } from "../../hooks/hooks";
import { Icon } from "../../components/common/Icon";
import { ConfirmModal } from "../../components/common/ConfirmModal";

// ─────────────────────────────────────────────────────────────────────────────
// BOOKS PAGE
// ─────────────────────────────────────────────────────────────────────────────
export function BooksPage({ navigate }) {
  const api = useApi();
  const { user } = useContext(AuthContext);
  const { toast, showToast } = useToast();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null | 'create' | {edit: book}
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    try { const r = await api.get("/books"); setBooks(r?.data || []); } catch {}
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (data) => {
    try { await api.post("/books", data); showToast("Libro añadido correctamente"); setModal(null); load(); }
    catch (e) { return e.message; }
  };

  const handleUpdate = async (id, data) => {
    try { await api.put(`/books/${id}`, data); showToast("Libro actualizado"); setModal(null); load(); }
    catch (e) { return e.message; }
  };

  const handleDelete = async (id) => {
    try { await api.del(`/books/${id}`); showToast("Libro eliminado"); setConfirm(null); load(); }
    catch (e) { showToast(e.message, "error"); setConfirm(null); }
  };

  const handleDeleteAll = async () => {
    try { await api.del("/books"); showToast("Todos los libros eliminados"); setConfirm(null); load(); }
    catch (e) { showToast(e.message, "error"); setConfirm(null); }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      {toast && <div className={`toast ${toast.type}`}><Icon name={toast.type === "success" ? "check" : "alert"} style={{ width: 18, height: 18 }} />{toast.msg}</div>}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
          <Icon name="search" style={{ width: 16, height: 16, color: "var(--ink-muted)" }} />
          <input placeholder="Buscar libros por título o autor..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {user.is_admin && (
          <>
            <button className="btn btn-primary btn-sm" onClick={() => setModal("create")}><Icon name="plus" /> Nuevo libro</button>
            <button className="btn btn-danger btn-sm" onClick={() => setConfirm({ type: "all" })}><Icon name="trash" /> Borrar todos</button>
          </>
        )}
      </div>
      {filtered.length === 0 ? (
        <div className="empty-state" style={{ padding: "80px 0" }}>
          <Icon name="book" /><h4>No se encontraron libros</h4><p>Prueba otra búsqueda o añade un nuevo libro.</p>
        </div>
      ) : (
        <div className="book-grid">
          {filtered.map(book => (
            <div className="book-card" key={book.id}>
              <div className="book-card-top">
                <h4>{book.title}</h4>
                <div className="author">{book.author}</div>
                <div className="summary">{book.summary}</div>
                <div className="book-card-meta">
                  <span className="meta-tag">ISBN: {book.isbn}</span>
                  <span className="meta-tag">{book.pages} pág.</span>
                  <span className="meta-tag">{book.publisher}</span>
                </div>
              </div>
              <div className="book-card-bottom">
                <button className="btn btn-ghost btn-sm" onClick={() => navigate("book-detail", { bookId: book.id })}>Ver detalle</button>
                {!user.is_admin && (
                  <button className="btn btn-primary btn-sm" style={{ marginLeft: "auto" }} onClick={() => navigate("add-review", { bookId: book.id })}>
                    <Icon name="star" /> Valorar
                  </button>
                )}
                {user.is_admin && (
                  <>
                    <button className="btn btn-secondary btn-sm" onClick={() => setModal({ edit: book })}><Icon name="edit" /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => setConfirm({ type: "one", id: book.id, title: book.title })}><Icon name="trash" /></button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* CREATE / EDIT MODAL */}
      {modal && (
        <BookModal
          open={!!modal}
          book={modal.edit || null}
          onClose={() => setModal(null)}
          onSave={modal.edit ? (d) => handleUpdate(modal.edit.id, d) : handleCreate}
        />
      )}
      {/* CONFIRM */}
      <ConfirmModal
        open={!!confirm}
        title={confirm?.type === "all" ? "Eliminar todos los libros" : "Eliminar libro"}
        message={confirm?.type === "all"
          ? "¿Estás seguro de que quieres eliminar todos los libros y sus valoraciones asociadas?"
          : <>¿Eliminar <strong>{confirm?.title}</strong>? Esta acción no puede deshacerse.</>}
        onConfirm={confirm?.type === "all" ? handleDeleteAll : () => handleDelete(confirm?.id)}
        onClose={() => setConfirm(null)}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOK MODAL
// ─────────────────────────────────────────────────────────────────────────────
function BookModal({ open, book, onClose, onSave }) {
  const [form, setForm] = useState(book ? { ...book } : { title: "", author: "", isbn: "", publisher: "", publish_date: "", pages: "", summary: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { setForm(book ? { ...book } : { title: "", author: "", isbn: "", publisher: "", publish_date: "", pages: "", summary: "" }); setError(""); }, [book, open]);

  const submit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    const err = await onSave({ ...form, pages: parseInt(form.pages) });
    if (err) setError(err);
    setLoading(false);
  };

  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{book ? "Editar libro" : "Nuevo libro"}</h3>
          <button className="modal-close" onClick={onClose}><Icon name="x" style={{ width: 16, height: 16 }} /></button>
        </div>
        <div className="modal-body">
          <form onSubmit={submit}>
            <div className="input-row">
              <div className="input-group"><label>Título</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
              <div className="input-group"><label>Autor</label><input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required /></div>
            </div>
            <div className="input-row">
              <div className="input-group"><label>ISBN</label><input value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} required /></div>
              <div className="input-group"><label>Editorial</label><input value={form.publisher} onChange={e => setForm({ ...form, publisher: e.target.value })} required /></div>
            </div>
            <div className="input-row">
              <div className="input-group"><label>Fecha publicación</label><input type="date" value={form.publish_date} onChange={e => setForm({ ...form, publish_date: e.target.value })} required /></div>
              <div className="input-group"><label>Páginas</label><input type="number" min="1" value={form.pages} onChange={e => setForm({ ...form, pages: e.target.value })} required /></div>
            </div>
            <div className="input-group"><label>Resumen</label><textarea value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} maxLength={1000} required style={{ minHeight: 100 }} /></div>
            {error && <div className="error-msg">{error}</div>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                {loading ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : (book ? "Guardar cambios" : "Crear libro")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useApi, useToast } from "../../hooks/hooks";
import { Icon } from "../../components/common/Icon";
import { ConfirmModal } from "../../components/common/ConfirmModal";

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN: USERS
// ─────────────────────────────────────────────────────────────────────────────
export function UsersPage() {
  const api = useApi();
  const { user: me } = useContext(AuthContext);
  const { toast, showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    try { const r = await api.get("/users"); setUsers(r?.data || []); } catch {}
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = async (data) => {
    try { await api.post("/users", { ...data, password_confirmation: data.password }); showToast("Usuario creado"); setModal(null); load(); }
    catch (e) { return e.message; }
  };

  const handleUpdate = async (id, data) => {
    try {
      const payload = { name: data.name, email: data.email };
      if (data.password) { payload.password = data.password; payload.password_confirmation = data.password; }
      await api.put(`/users/${id}`, payload);
      showToast("Usuario actualizado"); setModal(null); load();
    } catch (e) { return e.message; }
  };

  const handleDelete = async (id) => {
    try { await api.del(`/users/${id}`); showToast("Usuario eliminado"); setConfirm(null); load(); }
    catch (e) { showToast(e.message, "error"); setConfirm(null); }
  };

  const handleDeleteAll = async () => {
    try { await api.del("/users"); showToast("Usuarios no-admin eliminados"); setConfirm(null); load(); }
    catch (e) { showToast(e.message, "error"); setConfirm(null); }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      {toast && <div className={`toast ${toast.type}`}><Icon name={toast.type === "success" ? "check" : "alert"} style={{ width: 18, height: 18 }} />{toast.msg}</div>}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
          <Icon name="search" style={{ width: 16, height: 16, color: "var(--ink-muted)" }} />
          <input placeholder="Buscar usuarios..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setModal("create")}><Icon name="plus" /> Nuevo usuario</button>
        <button className="btn btn-danger btn-sm" onClick={() => setConfirm({ type: "all" })}><Icon name="trash" /> Borrar todos</button>
      </div>
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Valoraciones</th><th></th></tr></thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td><strong>{u.name}</strong> {u.id === me.id && <span style={{ fontSize: "0.68rem", color: "var(--ink-muted)" }}>(tú)</span>}</td>
                    <td>{u.email}</td>
                    <td><span className={`badge ${u.is_admin ? "badge-admin" : "badge-user"}`}>{u.is_admin ? "Admin" : "Usuario"}</span></td>
                    <td>—</td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-secondary btn-sm" onClick={() => setModal({ edit: u })}><Icon name="edit" /></button>
                        {u.id !== me.id && <button className="btn btn-danger btn-sm" onClick={() => setConfirm({ type: "one", id: u.id, name: u.name })}><Icon name="trash" /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", padding: 40, color: "var(--ink-muted)" }}>No se encontraron usuarios</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {modal && <UserModal open={!!modal} user={modal.edit || null} onClose={() => setModal(null)} onSave={modal.edit ? (d) => handleUpdate(modal.edit.id, d) : handleCreate} />}
      <ConfirmModal
        open={!!confirm}
        title={confirm?.type === "all" ? "Eliminar todos los usuarios" : "Eliminar usuario"}
        message={confirm?.type === "all"
          ? "¿Eliminar todos los usuarios excepto el administrador? Esto incluye sus valoraciones."
          : <>¿Eliminar <strong>{confirm?.name}</strong> y todas sus valoraciones?</>}
        onConfirm={confirm?.type === "all" ? handleDeleteAll : () => handleDelete(confirm?.id)}
        onClose={() => setConfirm(null)}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// USER MODAL
// ─────────────────────────────────────────────────────────────────────────────
function UserModal({ open, user, onClose, onSave }) {
  const [form, setForm] = useState(user ? { name: user.name, email: user.email, password: "" } : { name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { setForm(user ? { name: user.name, email: user.email, password: "" } : { name: "", email: "", password: "" }); setError(""); }, [user, open]);

  const submit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    const err = await onSave(form);
    if (err) setError(err);
    setLoading(false);
  };

  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{user ? "Editar usuario" : "Nuevo usuario"}</h3>
          <button className="modal-close" onClick={onClose}><Icon name="x" style={{ width: 16, height: 16 }} /></button>
        </div>
        <div className="modal-body">
          <form onSubmit={submit}>
            <div className="input-group"><label>Nombre</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="input-group"><label>Correo</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
            <div className="input-group">
              <label>Contraseña {user && <span style={{ fontWeight: 400, textTransform: "none", color: "var(--ink-muted)", letterSpacing: 0 }}>(dejar vacío para no cambiar)</span>}</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder={user ? "••••••••" : "Contraseña"} {...(!user ? { required: true } : {})} />
              {!user && <span className="hint">Min. 8 caracteres: mayúsculas, minúsculas, números y símbolos.</span>}
            </div>
            {error && <div className="error-msg">{error}</div>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                {loading ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : (user ? "Guardar" : "Crear usuario")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

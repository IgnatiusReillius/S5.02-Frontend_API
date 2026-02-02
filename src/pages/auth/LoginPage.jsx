import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Icon } from "../../components/common/Icon";

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export function LoginPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  if (showRegister) return <RegisterPage onBack={() => setShowRegister(false)} />;

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try { await login(email, password); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="logo-area">
          <div className="logo-icon"><Icon name="book" /></div>
          <h1>Mi Biblioteca</h1>
          <p>Inicia sesión para continuar</p>
        </div>
        <form onSubmit={submit}>
          <div className="input-group">
            <label>Correo electrónico</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" required />
          </div>
          <div className="input-group">
            <label>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : "Iniciar sesión"}
          </button>
        </form>
        <div className="auth-switch">¿No tienes cuenta? <a onClick={() => setShowRegister(true)}>Regístrate</a></div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER PAGE
// ─────────────────────────────────────────────────────────────────────────────
function RegisterPage({ onBack }) {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Las contraseñas no coinciden."); return; }
    setLoading(true);
    try { await register(name, email, password); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="logo-area">
          <div className="logo-icon"><Icon name="book" /></div>
          <h1>Mi Biblioteca</h1>
          <p>Crea tu cuenta</p>
        </div>
        <form onSubmit={submit}>
          <div className="input-group">
            <label>Nombre</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" required />
          </div>
          <div className="input-group">
            <label>Correo electrónico</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" required />
          </div>
          <div className="input-group">
            <label>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 caracteres" required />
            <span className="hint">Debe incluir mayúsculas, minúsculas, números y símbolos.</span>
          </div>
          <div className="input-group">
            <label>Confirmar contraseña</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repite tu contraseña" required />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : "Crear cuenta"}
          </button>
        </form>
        <div className="auth-switch">¿Ya tienes cuenta? <a onClick={onBack}>Inicia sesión</a></div>
      </div>
    </div>
  );
}

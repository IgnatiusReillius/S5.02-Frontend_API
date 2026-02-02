import { Icon } from "./Icon";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIRM MODAL
// ─────────────────────────────────────────────────────────────────────────────
export function ConfirmModal({ open, title, message, onConfirm, onClose, dangerLabel = "Eliminar" }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}><Icon name="x" style={{ width: 16, height: 16 }} /></button>
        </div>
        <div className="modal-body">
          <p className="confirm-msg">{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>Cancelar</button>
          <button className="btn btn-danger btn-sm" onClick={onConfirm}>{dangerLabel}</button>
        </div>
      </div>
    </div>
  );
}

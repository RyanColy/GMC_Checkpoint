import { useEffect } from "react";
import "./ConfirmDialog.css";

// ConfirmDialog — beautiful destructive-action confirmation (replaces window.confirm)
function ConfirmDialog({ isOpen, taskName, onConfirm, onCancel }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="cd-backdrop" onClick={onCancel} role="alertdialog" aria-modal="true">
      <div className="cd-card" onClick={(e) => e.stopPropagation()}>

        {/* Icon */}
        <div className="cd-icon-wrap">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </div>

        {/* Text */}
        <div className="cd-content">
          <h2 className="cd-title">Supprimer cette tâche ?</h2>
          <p className="cd-description">
            <span className="cd-task-name">"{taskName}"</span> sera définitivement supprimée.
            Cette action est irréversible.
          </p>
        </div>

        {/* Actions */}
        <div className="cd-actions">
          <button className="cd-btn cd-btn-cancel" onClick={onCancel}>
            Annuler
          </button>
          <button className="cd-btn cd-btn-delete" onClick={onConfirm}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            </svg>
            Supprimer
          </button>
        </div>

      </div>
    </div>
  );
}

export default ConfirmDialog;

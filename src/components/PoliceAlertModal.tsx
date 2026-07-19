interface PoliceAlertModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function PoliceAlertModal({ onConfirm, onCancel }: PoliceAlertModalProps) {
  return (
    <div className="police-modal" role="dialog" aria-modal="true">
      <div className="police-modal-card">
        <h2>Riasztás küldése</h2>
        <p>Biztosan riasztást küldesz a koordinátornak? Ez egy sürgősségi jelzés.</p>

        <div className="button-grid">
          <button onClick={onConfirm} style={{ background: '#b91c1c' }}>
            Küldés
          </button>
          <button className="link-button" onClick={onCancel}>
            Mégse
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { PoliceAlertModal } from './PoliceAlertModal';

export function AlertButton() {
  const [showModal, setShowModal] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  function handleConfirm() {
    setShowModal(false);
    setShowBanner(true);
    // simulate sending an alert (replace with real API call later)
    console.log('Riasztás elküldve');
    setTimeout(() => setShowBanner(false), 6000);
  }

  return (
    <>
      {showBanner && (
        <div className="police-banner" role="status">
          <strong>RIASZTÁS!</strong> Küldve a koordinátornak.
        </div>
      )}

      <button className="alert-button" onClick={() => setShowModal(true)} aria-label="SOS riasztás">
        SOS
      </button>

      {showModal && <PoliceAlertModal onConfirm={handleConfirm} onCancel={() => setShowModal(false)} />}
    </>
  );
}

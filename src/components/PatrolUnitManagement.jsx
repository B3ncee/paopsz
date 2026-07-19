import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './SidePanel.css';
import Modal from './Modal';

function PatrolUnitManagement({ patrolUnits, setPatrolUnits, allUsers }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [unitName, setUnitName] = useState('');

  const handleAddUnit = (e) => {
    e.preventDefault();
    if (!unitName) return;

    const newUnit = {
      id: Date.now(),
      name: unitName,
      members: [], // Kezdetben üres
    };

    setPatrolUnits([...patrolUnits, newUnit]);
    setModalOpen(false);
    setUnitName('');
  };

  return (
    <div className="side-panel-container">
      <h3>Járőregységek (Autók)</h3>
      <ul className="item-list">
        {patrolUnits.map(unit => (
          <li key={unit.id} className="item">
            {unit.name} ({unit.members.length} fő)
          </li>
        ))}
      </ul>
      <button className="add-new-button" onClick={() => setModalOpen(true)}>
        Új egység
      </button>

      {isModalOpen && (
        <Modal title="Új járőregység" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleAddUnit} className="modal-form">
            <div className="form-group">
              <label>Egység neve (pl. rendszám)</label>
              <input type="text" value={unitName} onChange={(e) => setUnitName(e.target.value)} required />
            </div>
            <button type="submit" className="add-new-button">Létrehozás</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

PatrolUnitManagement.propTypes = {
  patrolUnits: PropTypes.array.isRequired,
  setPatrolUnits: PropTypes.func.isRequired,
  allUsers: PropTypes.array.isRequired,
};

export default PatrolUnitManagement;
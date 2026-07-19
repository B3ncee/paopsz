import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './SidePanel.css';
import Modal from './Modal';
import { addMission } from '../storageService';

function MissionList({ missions, activePatrols }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [newMissionTitle, setNewMissionTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  const handleAddMission = async (e) => {
    e.preventDefault();
    if (newMissionTitle.trim() === '' || assignedTo === '') return;

    const newMission = {
      title: newMissionTitle,
      status: 'new',
      assignedTo: assignedTo, // Firestore-ban a string ID is jó
    };

    await addMission(newMission);
    setNewMissionTitle('');
    setAssignedTo('');
    setModalOpen(false);
  };

  return (
    <div className="side-panel-container">
      <h3>Küldetések</h3>
      <ul className="item-list">
        {missions.length > 0 ? (
          missions.map(mission => (
            <li key={mission.id} className="item">
              {mission.title}
            </li>
          ))
        ) : (
          <p className="empty-list-text">Nincsenek aktív küldetések.</p>
        )}
      </ul>
      <button className="add-new-button" onClick={() => setModalOpen(true)}>
        Új küldetés
      </button>

      {isModalOpen && (
        <Modal title="Új küldetés létrehozása" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleAddMission} className="modal-form">
            <div className="form-group">
              <label htmlFor="missionTitle">Küldetés leírása</label>
              <input
                id="missionTitle"
                type="text"
                value={newMissionTitle}
                onChange={(e) => setNewMissionTitle(e.target.value)}
                placeholder="Pl. Riasztás a Fő téren"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="assignTo">Hozzárendelés</label>
              <select
                id="assignTo"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                required
              >
                <option value="" disabled>Válassz járőrt...</option>
                {activePatrols.map(patrol => (
                  <option key={patrol.id} value={patrol.id}>
                    {patrol.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="add-new-button">Küldetés létrehozása</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

MissionList.propTypes = {
  missions: PropTypes.array.isRequired,
  activePatrols: PropTypes.array.isRequired,
};

export default MissionList;
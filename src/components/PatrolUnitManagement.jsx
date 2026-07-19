import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './SidePanel.css';
import Modal from './Modal';
import { addPatrolUnit, updatePatrolUnit } from '../storageService';

function PatrolUnitManagement({ patrolUnits, allUsers }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [unitName, setUnitName] = useState('');
  const [editingUnit, setEditingUnit] = useState(null);
  const [memberToAdd, setMemberToAdd] = useState('');

  const handleAddUnit = async (e) => {
    e.preventDefault();
    if (!unitName) return;

    const newUnit = {
      name: unitName,
      members: [], // Kezdetben üres
    };

    await addPatrolUnit(newUnit);
    setModalOpen(false);
    setUnitName('');
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberToAdd || !editingUnit) return;

    const updatedMembers = [...editingUnit.members, memberToAdd];
    await updatePatrolUnit(editingUnit.id, { members: updatedMembers });
    setEditingUnit(prev => ({ ...prev, members: updatedMembers }));
    setMemberToAdd('');
  };

  const handleRemoveMember = async (memberId) => {
    if (!editingUnit) return;

    const updatedMembers = editingUnit.members.filter(id => id !== memberId);
    await updatePatrolUnit(editingUnit.id, { members: updatedMembers });
    setEditingUnit(prev => ({ ...prev, members: updatedMembers }));
  };

  const closeEditModal = () => {
    setEditingUnit(null);
    setMemberToAdd('');
  };

  // Járőrök, akik még nincsenek egységhez rendelve
  const assignedMemberIds = new Set(patrolUnits.flatMap(unit => unit.members));
  const availablePatrols = allUsers.filter(
    user => user.role === 'patrol' && !assignedMemberIds.has(user.id)
  );

  const getMemberName = (memberId) => {
    return allUsers.find(u => u.id === memberId)?.name || 'Ismeretlen tag';
  };

  return (
    <div className="side-panel-container">
      <h3>Járőregységek (Autók)</h3>
      <ul className="item-list">
        {patrolUnits.map(unit => (
          <li key={unit.id} className="item clickable" onClick={() => setEditingUnit(unit)}>
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

      {editingUnit && (
        <Modal title={`"${editingUnit.name}" egység kezelése`} onClose={closeEditModal}>
          <h4>Tagok</h4>
          <ul className="item-list member-list">
            {editingUnit.members.length > 0 ? (
              editingUnit.members.map(memberId => (
                <li key={memberId} className="item">
                  <span>{getMemberName(memberId)}</span>
                  <button onClick={() => handleRemoveMember(memberId)} className="remove-button">Eltávolítás</button>
                </li>
              ))
            ) : (
              <p className="empty-list-text">Nincsenek tagok az egységben.</p>
            )}
          </ul>

          <hr className="modal-divider" />

          <h4>Új tag hozzáadása</h4>
          <form onSubmit={handleAddMember} className="modal-form">
            <div className="form-group">
              <label>Elérhető járőrök</label>
              <select value={memberToAdd} onChange={(e) => setMemberToAdd(e.target.value)} required>
                <option value="" disabled>Válassz egy járőrt...</option>
                {availablePatrols.map(patrol => (
                  <option key={patrol.id} value={patrol.id}>{patrol.name}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="add-new-button"
              disabled={availablePatrols.length === 0}
            >
              {availablePatrols.length > 0 ? 'Tag hozzáadása' : 'Nincs elérhető járőr'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

PatrolUnitManagement.propTypes = {
  patrolUnits: PropTypes.array.isRequired,
  allUsers: PropTypes.array.isRequired,
};

export default PatrolUnitManagement;
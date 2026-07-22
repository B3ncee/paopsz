import React from 'react';
import PropTypes from 'prop-types';
import './PatrolUnitList.css';

function PatrolUnitList({ patrolUnits, users }) {
  // Gyors keresési térkép a felhasználókhoz ID alapján
  const userMap = new Map(users.map(user => [user.id, user]));

  const getMemberDetails = (member) => {
    // A diszpécser egység tagjai már tartalmazzák a nevet és a telefonszámot
    if (member.name && member.phone) {
      return `${member.name} (${member.phone})`;
    }
    // A normál egységek tagjai csak ID-t tárolnak
    const user = userMap.get(member);
    return user ? `${user.fullName} (${user.phoneNumber})` : 'Ismeretlen tag';
  };

  return (
    <div className="patrol-unit-list-container">
      <h2>Aktuális Egységek</h2>
      {patrolUnits.length === 0 ? (
        <p>Nincs egyetlen egység sem szolgálatban.</p>
      ) : (
        <ul className="unit-list">
          {patrolUnits.map(unit => (
            <li key={unit.id} className="unit-card">
              <div className="unit-card-header">{unit.name}</div>
              <ul className="unit-members">
                {unit.members.map((member, index) => (
                  <li key={index}>{getMemberDetails(member)}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

PatrolUnitList.propTypes = {
  patrolUnits: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
};

export default PatrolUnitList;
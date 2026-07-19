import React from 'react';
import PropTypes from 'prop-types';
import './SidePanel.css';

function PatrolList({ patrols }) {
  return (
    <div className="side-panel-container">
      <h3>Járőrök</h3>
      <ul className="item-list">
        {patrols.map(patrol => (
          <li key={patrol.id} className="item">
            <span className="item-name">{patrol.name}</span>
            <span className={`status-indicator ${patrol.status}`}>
              {patrol.status === 'active' ? 'Szolgálatban' : 'Inaktív'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

PatrolList.propTypes = {
  patrols: PropTypes.array.isRequired,
};

export default PatrolList;
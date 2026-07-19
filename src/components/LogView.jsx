import React from 'react';
import PropTypes from 'prop-types';
import './SidePanel.css';

function LogView({ logs }) {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'folyamatban...';
    return new Date(timestamp.seconds * 1000).toLocaleString('hu-HU');
  };

  return (
    <div className="side-panel-container">
      <h3>LOG</h3>
      <ul className="item-list log-list">
        {logs.length > 0 ? (
          logs.map(log => (
            <li key={log.id} className="item log-item">
              <span className="log-message">{log.message}</span>
              <span className="log-timestamp">{formatDate(log.timestamp)}</span>
            </li>
          ))
        ) : (
          <p className="empty-list-text">Nincsenek naplóbejegyzések.</p>
        )}
      </ul>
    </div>
  );
}

LogView.propTypes = {
  logs: PropTypes.array.isRequired,
};

export default LogView;
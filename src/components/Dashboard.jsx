import React, { useState } from 'react';
import MapView from './MapView';
import PatrolList from './PatrolList';
import MissionList from './MissionList';
import PatrolUnitManagement from './PatrolUnitManagement';
import LogView from './LogView';
import UserManagement from './UserManagement';
import DispatcherDutyControl from './DispatcherDutyControl';
import PropTypes from 'prop-types';
import './Dashboard.css';

function Dashboard({ user, users, missions, logs, patrolUnits, patrolLocations }) {
  const activePatrols = users.filter(u => u.role === 'patrol' && u.status === 'active');
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handlePatrolSelect = (patrol) => {
    const locationData = patrolLocations[patrol.id];
    if (locationData && locationData.location) {
      setSelectedLocation([locationData.location.lat, locationData.location.lng]);
    }
  };

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <h3>Diszpécser Központ</h3>
        <DispatcherDutyControl user={user} />
      </header>
      <aside className="sidebar">
        {user.role === 'leader' && (
          <div className="sidebar-section">
            <UserManagement users={users} currentUser={user} />
          </div>
        )}
        <div className="sidebar-section">
          <PatrolList
            patrols={users.filter(u => u.role === 'patrol')}
            onPatrolSelect={handlePatrolSelect}
          />
        </div>
        <div className="sidebar-section">
          <MissionList
            missions={missions}
            activePatrols={activePatrols}
          />
        </div>
        <div className="sidebar-section">
            <PatrolUnitManagement
              patrolUnits={patrolUnits}
              allUsers={users}
            />
        </div>
        {user.role === 'leader' && (
          <div className="sidebar-section">
            <LogView logs={logs} />
          </div>
        )}
      </aside>
      <main className="main-content">
        <MapView patrolLocations={patrolLocations} center={selectedLocation} />
      </main>
    </div>
  );
}

Dashboard.propTypes = {
    user: PropTypes.object.isRequired,
    users: PropTypes.array.isRequired,
    missions: PropTypes.array.isRequired,
    logs: PropTypes.array.isRequired,
    patrolUnits: PropTypes.array.isRequired,
    patrolLocations: PropTypes.object.isRequired,
    canManageUsers: PropTypes.bool, // Ez a prop már átadásra kerül az App.jsx-ből
};

export default Dashboard;
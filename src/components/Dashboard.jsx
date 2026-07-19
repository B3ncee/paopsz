import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MapView from './MapView';
import PatrolList from './PatrolList';
import MissionList from './MissionList';
import UserManagement from './UserManagement';
import PatrolUnitManagement from './PatrolUnitManagement';
import './Dashboard.css';

function Dashboard({ user, users, missions, patrolUnits, patrolLocations }) {
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
      <aside className="sidebar">
        {user.role === 'leader' && (
          <div className="sidebar-section">
            <UserManagement users={users} />
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
    patrolUnits: PropTypes.array.isRequired,
    patrolLocations: PropTypes.object.isRequired,
};

export default Dashboard;
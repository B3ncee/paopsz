import React from 'react';
import PropTypes from 'prop-types';
import MapView from './MapView';
import PatrolList from './PatrolList';
import MissionList from './MissionList';
import UserManagement from './UserManagement';
import PatrolUnitManagement from './PatrolUnitManagement';
import './Dashboard.css';

function Dashboard({ user, users, setUsers, missions, setMissions, patrolUnits, setPatrolUnits, patrolLocations }) {
  const activePatrols = users.filter(u => u.role === 'patrol' && u.status === 'active');

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        {user.role === 'leader' && (
          <div className="sidebar-section">
            <UserManagement users={users} setUsers={setUsers} />
          </div>
        )}
        <div className="sidebar-section">
          <PatrolList patrols={users.filter(u => u.role === 'patrol')} />
        </div>
        <div className="sidebar-section">
          <MissionList
            missions={missions}
            setMissions={setMissions}
            activePatrols={activePatrols}
          />
        </div>
        <div className="sidebar-section">
            <PatrolUnitManagement
              patrolUnits={patrolUnits}
              setPatrolUnits={setPatrolUnits}
              allUsers={users}
            />
        </div>
      </aside>
      <main className="main-content">
        <MapView patrolLocations={patrolLocations} />
      </main>
    </div>
  );
}

Dashboard.propTypes = {
    user: PropTypes.object.isRequired,
    users: PropTypes.array.isRequired,
    setUsers: PropTypes.func.isRequired,
    missions: PropTypes.array.isRequired,
    setMissions: PropTypes.func.isRequired,
    patrolUnits: PropTypes.array.isRequired,
    setPatrolUnits: PropTypes.func.isRequired,
    patrolLocations: PropTypes.object.isRequired,
};

export default Dashboard;
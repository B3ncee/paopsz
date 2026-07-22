import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MapView from './MapView';
import MissionList from './MissionList';
import LogViewer from './LogViewer';
import UserManagement from './UserManagement';
import DispatcherDutyControl from './DispatcherDutyControl';
import './Dashboard.css';
import PatrolUnitList from './PatrolUnitList';

function Dashboard({ user, users, missions, logs, patrolUnits, patrolLocations, canManageUsers }) {
  const [activeTab, setActiveTab] = useState('map');

  const renderContent = () => {
    switch (activeTab) {
      case 'map':
        return <MapView patrolLocations={patrolLocations} patrolUnits={patrolUnits} />;
      case 'missions':
        return <MissionList missions={missions} patrolUnits={patrolUnits} />;
      case 'logs':
        return <LogViewer logs={logs} />;
      case 'users':
        if (canManageUsers) {
          return <UserManagement users={users} />;
        }
        return <div>Nincs jogosultságod a felhasználók kezeléséhez.</div>;
      case 'units':
        return <PatrolUnitList patrolUnits={patrolUnits} users={users} />;
      default:
        return <MapView patrolLocations={patrolLocations} patrolUnits={patrolUnits} />;
    }
  };

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <span className="header-title">Diszpécser Központ</span>
        <DispatcherDutyControl user={user} />
      </header>
      <div className="dashboard-tabs">
        <button onClick={() => setActiveTab('map')} className={activeTab === 'map' ? 'active' : ''}>Térkép</button>
        <button onClick={() => setActiveTab('units')} className={activeTab === 'units' ? 'active' : ''}>Egységek</button>
        <button onClick={() => setActiveTab('missions')} className={activeTab === 'missions' ? 'active' : ''}>Riasztások</button>
        <button onClick={() => setActiveTab('logs')} className={activeTab === 'logs' ? 'active' : ''}>Log</button>
        {canManageUsers && (
          <button onClick={() => setActiveTab('users')} className={activeTab === 'users' ? 'active' : ''}>Felhasználók</button>
        )}
      </div>
      <main className="main-content">
        {renderContent()}
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
  canManageUsers: PropTypes.bool,
};

export default Dashboard;
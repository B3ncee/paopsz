import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaBars, FaTimes, FaUserFriends, FaClipboardList, FaCar, FaHistory, FaMapMarkedAlt } from 'react-icons/fa';
import './Sidebar.css';

function Sidebar({ user, onLogout, children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar-layout ${isCollapsed ? 'collapsed' : ''}`}>
      <aside className="sidebar-nav">
        <div className="sidebar-header">
          {!isCollapsed && <span className="sidebar-brand">PAOPSZ</span>}
          <button onClick={toggleSidebar} className="toggle-button">
            {isCollapsed ? <FaBars /> : <FaTimes />}
          </button>
        </div>
        <div className="sidebar-user">
            <div className="user-avatar">{user.name.charAt(0)}</div>
            {!isCollapsed && (
                <div className="user-details">
                    <span className="user-name">{user.name}</span>
                    <span className="user-role">{user.role}</span>
                </div>
            )}
        </div>
        <nav className="sidebar-menu">
            {/* Itt lehetne a menüpontokat dinamikusan kezelni */}
            <a href="#" className="menu-item"><FaMapMarkedAlt /> {!isCollapsed && 'Térkép'}</a>
            <a href="#" className="menu-item"><FaUserFriends /> {!isCollapsed && 'Szolgálat'}</a>
            <a href="#" className="menu-item"><FaClipboardList /> {!isCollapsed && 'Küldetések'}</a>
            <a href="#" className="menu-item"><FaHistory /> {!isCollapsed && 'Események'}</a>
        </nav>
        <div className="sidebar-footer">
            <button onClick={onLogout} className="logout-button">
                Kijelentkezés
            </button>
        </div>
      </aside>
      <main className="sidebar-content">
        {children}
      </main>
    </div>
  );
}

Sidebar.propTypes = {
  user: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Sidebar;
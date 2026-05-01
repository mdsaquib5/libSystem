"use client";

import React, { useState } from 'react';
import { 
  MdDashboard, 
  MdEventSeat, 
  MdPersonAdd, 
  MdGroup, 
  MdCheckCircle, 
  MdLogout,
  MdMenu,
  MdClose
} from 'react-icons/md';

import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'next/navigation';

const Sidebar = ({ activeMenu, setActiveMenu }) => {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <MdDashboard /> },
    { id: 'availability', label: 'Availability', icon: <MdEventSeat /> },
    { id: 'admission', label: 'Admission', icon: <MdPersonAdd /> },
    { id: 'students', label: 'Students', icon: <MdGroup /> },
    { id: 'attendance', label: 'Attendance', icon: <MdCheckCircle /> },
  ];

  const handleNavClick = (id) => {
    setActiveMenu(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile top bar */}
      <header className="mobile-topbar">
        <div className="sidebar-logo">
          <MdEventSeat style={{ fontSize: '24px', color: 'var(--primary)' }} />
          <span>LibSystem</span>
        </div>
        <button 
          className="hamburger-btn" 
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <MdMenu />
        </button>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setMobileOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-logo">
          <MdEventSeat style={{ fontSize: '28px', color: 'var(--primary)' }} />
          <span className="sidebar-logo-text">LibSystem</span>
          <button 
            className="sidebar-close-btn" 
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <MdClose />
          </button>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button 
            className="btn btn-outline sidebar-logout-btn"
            onClick={() => logout(router)}
          >
            <MdLogout />
            <span className="menu-label">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

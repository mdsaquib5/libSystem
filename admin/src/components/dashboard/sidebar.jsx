import React from 'react';
import { 
  MdDashboard, 
  MdEventSeat, 
  MdPersonAdd, 
  MdGroup, 
  MdCheckCircle, 
  MdPayments,
  MdLogout 
} from 'react-icons/md';

import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'next/navigation';

const Sidebar = ({ activeMenu, setActiveMenu }) => {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <MdDashboard /> },
    { id: 'availability', label: 'Availability', icon: <MdEventSeat /> },
    { id: 'admission', label: 'Admission', icon: <MdPersonAdd /> },
    { id: 'students', label: 'Students', icon: <MdGroup /> },
    { id: 'attendance', label: 'Attendance', icon: <MdCheckCircle /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <MdEventSeat style={{ fontSize: '28px', color: 'var(--primary)' }} />
        <span>LibSystem</span>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
            onClick={() => setActiveMenu(item.id)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button 
          className="btn btn-outline" 
          style={{ color: 'var(--white)', borderColor: 'rgba(255,255,255,0.1)' }}
          onClick={() => logout(router)}
        >
          <MdLogout />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

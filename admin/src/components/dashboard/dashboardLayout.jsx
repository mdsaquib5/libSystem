"use client";

import React, { useState } from 'react';
import Sidebar from './sidebar';
import Overview from './views/overview';
import Availability from './views/availability';
import Admission from './views/admission';
import Students from './views/students';
import Attendance from './views/attendance';

const DashboardLayout = () => {
  const [activeMenu, setActiveMenu] = useState('overview');

  const renderContent = () => {
    switch (activeMenu) {
      case 'overview':
        return <Overview />;
      case 'availability':
        return <Availability />;
      case 'admission':
        return <Admission />;
      case 'students':
        return <Students />;
      case 'attendance':
        return <Attendance />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="layout-container">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default DashboardLayout;

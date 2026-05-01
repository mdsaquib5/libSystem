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

  return (
    <div className="layout-container">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <main className="main-content">
        <div style={{ display: activeMenu === 'overview' ? 'block' : 'none' }}><Overview /></div>
        <div style={{ display: activeMenu === 'availability' ? 'block' : 'none' }}><Availability /></div>
        <div style={{ display: activeMenu === 'admission' ? 'block' : 'none' }}><Admission /></div>
        <div style={{ display: activeMenu === 'students' ? 'block' : 'none' }}><Students /></div>
        <div style={{ display: activeMenu === 'attendance' ? 'block' : 'none' }}><Attendance /></div>
      </main>
    </div>
  );
};

export default DashboardLayout;

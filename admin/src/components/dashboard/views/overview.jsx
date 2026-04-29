"use client";

import React from 'react';
import { MdEventSeat, MdPeople, MdCheckCircle, MdCancel } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '@/api/dashboard.api';

const MetricCard = ({ title, value, icon, variant, isLoading }) => (
  <div className="card metric-card">
    <div className="metric-info">
      <span className="metric-title">{title}</span>
      <span className="metric-value">{isLoading ? '...' : value}</span>
    </div>
    <div className={`metric-icon-wrapper icon-${variant}`}>
      {icon}
    </div>
  </div>
);

const Overview = () => {
  const { data: statsRes, isLoading } = useQuery({ 
    queryKey: ['dashboard-stats'], 
    queryFn: getDashboardStats 
  });

  const stats = statsRes?.data || {
    totalStudents: 0,
    presentStudents: 0,
    absentStudents: 0,
    freeSeats: 0
  };

  return (
    <div className="overview-container">
      <div className="overview-header">
        <h1>Dashboard Overview</h1>
        <p>Real-time analytics and library performance metrics.</p>
      </div>

      <div className="overview-grid">
        <MetricCard 
          title="Total Students" 
          value={stats.totalStudents} 
          icon={<MdPeople />} 
          variant="blue" 
          isLoading={isLoading}
        />
        <MetricCard 
          title="Present Students" 
          value={stats.presentStudents} 
          icon={<MdCheckCircle />} 
          variant="green" 
          isLoading={isLoading}
        />
        <MetricCard 
          title="Absent Students" 
          value={stats.absentStudents} 
          icon={<MdCancel />} 
          variant="purple" 
          isLoading={isLoading}
        />
        <MetricCard 
          title="Free Seats" 
          value={stats.freeSeats} 
          icon={<MdEventSeat />} 
          variant="orange" 
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Overview;

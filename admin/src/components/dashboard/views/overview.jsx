"use client";

import React from 'react';
import { MdEventSeat, MdPeople, MdCheckCircle, MdCancel } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '@/api/dashboard.api';

const MetricCard = ({ title, value, icon, variant, isLoading }) => (
  <div className={`card metric-card ${isLoading ? 'skeleton-metric' : ''}`}>
    <div className="metric-info">
      <span className="metric-title" style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px' }}>{title}</span>
      {isLoading ? (
        <div className="skeleton skeleton-title" style={{ width: '40px', marginTop: '8px' }}></div>
      ) : (
        <span className="metric-value" style={{ fontSize: '28px', marginTop: '4px' }}>{value}</span>
      )}
    </div>
    <div className={`metric-icon-wrapper icon-${variant}`} style={{ width: '44px', height: '44px', borderRadius: '12px' }}>
      {isLoading ? <div className="skeleton skeleton-circle" style={{ width: '24px', height: '24px' }}></div> : icon}
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
    totalSeats: 0,
    totalSlots: 0,
    totalAvailableSlots: 0,
    totalOccupiedSlots: 0,
    seatAvailability: []
  };

  return (
    <div className="overview-container">
      <div className="overview-header">
        <h1>Dashboard Overview</h1>
        <p>Real-time analytics and library performance metrics.</p>
      </div>

      <h2 className="section-title mt-xl mb-md">General Metrics</h2>
      <div className="stats-grid-6">
        <MetricCard 
          title="Total Students" 
          value={stats.totalStudents} 
          icon={<MdPeople />} 
          variant="blue" 
          isLoading={isLoading}
        />
        <MetricCard 
          title="Present Today" 
          value={stats.presentStudents} 
          icon={<MdCheckCircle />} 
          variant="green" 
          isLoading={isLoading}
        />
        <MetricCard 
          title="Absent Today" 
          value={stats.absentStudents} 
          icon={<MdCancel />} 
          variant="purple" 
          isLoading={isLoading}
        />
        <MetricCard 
          title="Total Seats" 
          value={stats.totalSeats} 
          icon={<MdEventSeat />} 
          variant="orange" 
          isLoading={isLoading}
        />
        <MetricCard 
          title="Available Slots" 
          value={stats.totalAvailableSlots} 
          icon={<MdCheckCircle />} 
          variant="green" 
          isLoading={isLoading}
        />
        <MetricCard 
          title="Occupied Slots" 
          value={stats.totalOccupiedSlots} 
          icon={<MdCancel />} 
          variant="purple" 
          isLoading={isLoading}
        />
      </div>

      <h2 className="section-title mt-xl mb-md">Seat-wise Availability Stats</h2>
      <div className="stats-grid-6">
        {isLoading ? (
          [1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="card p-md skeleton-metric" style={{ height: '80px' }}></div>
          ))
        ) : stats.seatAvailability.map((seat) => (
          <div key={seat.seatId} className="card seat-stat-card">
            <MdEventSeat className="text-primary" fontSize="20px" />
            <span className="seat-stat-number">{seat.seatNumber}</span>
            <span className={`badge-count ${seat.availableSlots > 0 ? 'badge-count-active' : 'badge-count-inactive'}`} style={{ margin: 0 }}>
              {seat.availableSlots} Available
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;

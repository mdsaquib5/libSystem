"use client";

import React from 'react';
import { MdEventSeat, MdPeople, MdCheckCircle, MdCancel } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import { getSeats } from '@/api/seat.api';
import { getTodayAttendance } from '@/api/attendance.api';
import { getStudents } from '@/api/student.api';

const MetricCard = ({ title, value, icon, variant }) => (
  <div className="card metric-card">
    <div className="metric-info">
      <span className="metric-title">{title}</span>
      <span className="metric-value">{value}</span>
    </div>
    <div className={`metric-icon-wrapper icon-${variant}`}>
      {icon}
    </div>
  </div>
);

const Overview = () => {
  const { data: seatsRes } = useQuery({ queryKey: ['seats'], queryFn: getSeats });
  const { data: attendanceRes } = useQuery({ queryKey: ['attendance'], queryFn: getTodayAttendance });
  const { data: studentsRes } = useQuery({ queryKey: ['students'], queryFn: getStudents });

  const seats = seatsRes?.data || [];
  const attendance = attendanceRes?.data || [];
  const students = studentsRes?.data || [];

  const totalStudents = students.length;
  const presentStudents = attendance.filter(r => r.status === 'present').length;
  const absentStudents = attendance.filter(r => r.status === 'absent').length;
  const totalSeats = seats.length;
  
  const occupiedSeatsCount = seats.filter(seat => 
    seat.slots.some(slot => slot.status === 'occupied')
  ).length;

  const freeSeats = totalSeats - occupiedSeatsCount;

  return (
    <div className="overview-container">
      <div className="overview-header">
        <h1>Dashboard Overview</h1>
        <p>Real-time analytics and library performance metrics.</p>
      </div>

      <div className="overview-grid">
        <MetricCard 
          title="Total Students" 
          value={totalStudents} 
          icon={<MdPeople />} 
          variant="blue" 
        />
        <MetricCard 
          title="Present Students" 
          value={presentStudents} 
          icon={<MdCheckCircle />} 
          variant="green" 
        />
        <MetricCard 
          title="Absent Students" 
          value={absentStudents} 
          icon={<MdCancel />} 
          variant="purple" 
        />
        <MetricCard 
          title="Free Seats" 
          value={freeSeats > 0 ? freeSeats : 0} 
          icon={<MdEventSeat />} 
          variant="orange" 
        />
      </div>
    </div>
  );
};

export default Overview;

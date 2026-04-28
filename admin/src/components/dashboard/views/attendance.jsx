"use client";

import React, { useState } from 'react';
import { MdCheckCircle, MdCancel, MdGroups, MdAccessTime, MdEventSeat, MdPerson } from 'react-icons/md';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as attendanceApi from '@/api/attendance.api';
import { toast } from 'react-hot-toast';

const AttendanceCard = ({ record, onStatusToggle }) => {
  const { student, status, _id } = record;
  const seat = student?.seatId;
  const slot = seat?.slots?.find(s => s._id.toString() === record.slotId.toString());

  const formatTime = (timeObj) => {
    if (!timeObj) return "";
    return `${timeObj.hour}:${timeObj.minute} ${timeObj.period}`;
  };

  return (
    <div className={`card attendance-card ${status}`}>
      <div className="flex-between">
        <div className="student-info-row">
          <div className="student-avatar avatar-small">
            {student?.profileImage ? (
              <img 
                src={student.profileImage} 
                alt={student.name} 
                className="avatar-img"
              />
            ) : (
              <MdPerson className="icon-sm" />
            )}
          </div>
          <div className="student-details">
            <span className="student-name">{student?.name}</span>
            <span className="student-phone">{student?.phone}</span>
          </div>
        </div>
        <div className={`status-badge ${status}`}>
          {status === 'present' ? <MdCheckCircle /> : <MdCancel />}
          {status}
        </div>
      </div>

      <div className="attendance-meta">
        <div className="meta-item">
          <MdEventSeat />
          <span>{seat?.seatNumber || 'N/A'}</span>
        </div>
        <div className="meta-item">
          <MdAccessTime />
          <span>{slot ? `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}` : 'N/A'}</span>
        </div>
      </div>

      <div className="attendance-actions">
        <button 
          className={`btn-toggle ${status === 'present' ? 'absent' : 'present'}`}
          onClick={() => onStatusToggle(_id, status === 'present' ? 'absent' : 'present')}
        >
          Mark as {status === 'present' ? 'Absent' : 'Present'}
        </button>
      </div>
    </div>
  );
};

const Attendance = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');

  const { data: attendanceResponse, isLoading, isError } = useQuery({
    queryKey: ['attendance'],
    queryFn: attendanceApi.getTodayAttendance
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => attendanceApi.updateAttendance(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['attendance']);
      toast.success('Attendance updated');
    }
  });

  const records = attendanceResponse?.data || [];

  const filteredRecords = records.filter(r => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  if (isLoading) return <div className="p-xl">Loading attendance...</div>;
  if (isError) return <div className="p-xl text-red-500">Error loading attendance</div>;

  return (
    <div className="attendance-container">
      <div className="students-header">
        <h1>Attendance Tracker</h1>
        <p>Monitor real-time presence and track daily library occupancy.</p>
      </div>

      <div className="attendance-toggle">
        <div 
          className={`toggle-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({records.length})
        </div>
        <div 
          className={`toggle-btn ${filter === 'present' ? 'active' : ''}`}
          onClick={() => setFilter('present')}
        >
          Present ({records.filter(r => r.status === 'present').length})
        </div>
        <div 
          className={`toggle-btn ${filter === 'absent' ? 'active' : ''}`}
          onClick={() => setFilter('absent')}
        >
          Absent ({records.filter(r => r.status === 'absent').length})
        </div>
      </div>

      {filteredRecords.length > 0 ? (
        <div className="student-grid">
          {filteredRecords.map((record) => (
            <AttendanceCard 
              key={record._id} 
              record={record}
              onStatusToggle={(id, status) => updateMutation.mutate({ id, status })}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          {filter === 'present' ? <MdCheckCircle className="empty-icon" /> : <MdCancel className="empty-icon" />}
          <h3>No {filter} students</h3>
          <p>Try adjusting your filter.</p>
        </div>
      )}
    </div>
  );
};

export default Attendance;

"use client";

import React from 'react';
import { MdPerson, MdPhone, MdEventSeat, MdAccessTime, MdDelete } from 'react-icons/md';

const StudentCard = ({ student, onRemove, onStatusChange }) => {
  const formatTime = (timeObj) => {
    if (!timeObj) return "";
    return `${timeObj.hour}:${timeObj.minute} ${timeObj.period}`;
  };

  const seat = student.seatId;
  const slot = seat?.slots?.find(s => s._id.toString() === student.slotId.toString());

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className={`card student-card ${student.status === 'expired' ? 'inactive' : ''}`}>
      <div className="student-info-row">
        <div className="student-avatar avatar-medium">
          {student.profileImage ? (
            <img 
              src={student.profileImage} 
              alt={student.name} 
              className="avatar-img"
            />
          ) : (
            <MdPerson className="icon-md" />
          )}
        </div>
        <div className="student-details">
          <span className="student-name">{student.name}</span>
          <span className="student-phone">
            <MdPhone className="meta-icon-sm" />
            {student.phone}
          </span>
        </div>
      </div>

      <div className="student-meta py-12">
        <div className="meta-item">
          <span className="meta-label">
            <MdEventSeat className="mr-4" />
            Seat & Slot
          </span>
          <span className="meta-value">
            {seat?.seatNumber || 'N/A'} 
            <small style={{ display: 'block', fontSize: '10px', fontWeight: '500' }}>
              {slot ? `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}` : 'N/A'}
            </small>
          </span>
        </div>
        <div className="meta-item">
          <span className="meta-label">
            <MdAccessTime className="mr-4" />
            Booking Period
          </span>
          <span className="meta-value" style={{ fontSize: '11px' }}>
            {formatDate(student.startDate)} - {formatDate(student.endDate)}
          </span>
        </div>
      </div>

      <div className="student-actions">
        <select 
          className={`status-select ${student.status}`} 
          value={student.status}
          onChange={(e) => onStatusChange(student._id, e.target.value)}
          disabled={student.isUpdating}
        >
          <option value="active">{student.isUpdating ? 'Updating...' : 'Active'}</option>
          <option value="expired">{student.isUpdating ? 'Updating...' : 'Expired'}</option>
        </select>

        <button 
          className="btn-remove-student"
          onClick={() => onRemove(student._id)}
          disabled={student.isDeleting}
        >
          <MdDelete />
          {student.isDeleting ? 'Removing...' : 'Remove'}
        </button>
      </div>
    </div>
  );
};

export default StudentCard;

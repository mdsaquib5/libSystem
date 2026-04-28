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

  return (
    <div className={`card student-card ${student.status === 'inactive' ? 'inactive' : ''}`}>
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
            Seat
          </span>
          <span className="meta-value">{seat?.seatNumber || 'N/A'}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">
            <MdAccessTime className="mr-4" />
            Slot ({slot?.day || 'N/A'})
          </span>
          <span className="meta-value text-xs">
            {slot ? `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}` : 'N/A'}
          </span>
        </div>
      </div>

      <div className="student-actions">
        <select 
          className={`status-select ${student.status}`} 
          value={student.status}
          onChange={(e) => onStatusChange(student._id, e.target.value)}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button 
          className="btn-remove-student"
          onClick={() => onRemove(student._id)}
        >
          <MdDelete />
          Remove
        </button>
      </div>
    </div>
  );
};

export default StudentCard;

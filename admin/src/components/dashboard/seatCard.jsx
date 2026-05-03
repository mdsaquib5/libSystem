"use client";

import React, { useState } from 'react';
import { MdEdit, MdCheck, MdClose, MdAdd, MdDelete } from 'react-icons/md';
import TimeInput from './timeInput';

const formatTime = (timeObj) => {
  if (!timeObj) return "";
  return `${timeObj.hour}:${timeObj.minute} ${timeObj.period}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const Slot = ({ id, startTime, endTime, status, bookingEndDate, onEdit, onDelete }) => {
  return (
    <div className={`slot ${status}`}>
      <div className="slot-main-info">
        <div className="slot-time">{formatTime(startTime)} - {formatTime(endTime)}</div>
        <div className="slot-status">
          {status === 'occupied' ? (
            <span className="occupied-till text-xs font-600">Occupied till: {formatDate(bookingEndDate)}</span>
          ) : (
            <span className="available-label text-xs font-600">Available</span>
          )}
        </div>
      </div>
      <div className="slot-actions">
        <button onClick={() => onDelete(id)} className="btn-slot-delete"><MdDelete /></button>
      </div>
    </div>
  );
};

const SeatCard = ({ seatId, name: initialName, slots = [], onUpdateSeat, onDeleteSeat, onAddSlot, onDeleteSlot }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [tempName, setTempName] = useState(initialName);

  const [newSlotData, setNewSlotData] = useState({
    startTime: { hour: '09', minute: '00', period: 'AM' },
    endTime: { hour: '11', minute: '00', period: 'AM' },
    status: 'available'
  });

  const handleSaveName = () => {
    onUpdateSeat(seatId, tempName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempName(initialName);
    setIsEditing(false);
  };

  const handleAddSlotSubmit = () => {
    onAddSlot(seatId, newSlotData);
    setIsAddingSlot(false);
  };

  return (
    <div className={`card seat-card ${isEditing || isAddingSlot ? 'editing' : ''}`}>
      <div className="seat-header">
        {isEditing ? (
          <input
            className="seat-name-input"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            autoFocus
          />
        ) : (
          <span className="seat-number">{initialName}</span>
        )}

        <div className="flex-center gap-4">
          {isEditing ? (
            <>
              <button className="btn-icon btn-cancel" onClick={handleCancel}><MdClose /></button>
              <button className="btn-icon btn-save" onClick={handleSaveName}><MdCheck /></button>
            </>
          ) : (
            <>
              {!isAddingSlot && (
                <>
                  <button className="edit-btn" onClick={() => setIsEditing(true)}><MdEdit /></button>
                  <button className="delete-btn" onClick={() => onDeleteSeat(seatId)}><MdDelete /></button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div className="slots-container">
        {!isAddingSlot && slots.map((slot) => (
          <Slot
            key={slot._id}
            id={slot._id}
            startTime={slot.startTime}
            endTime={slot.endTime}
            status={slot.status}
            bookingEndDate={slot.bookingEndDate}
            onDelete={(slotId) => onDeleteSlot(seatId, slotId)}
          />
        ))}

        {isAddingSlot && (
          <div className="new-slot-form grid-full">
            <TimeInput
              label="Start"
              value={newSlotData.startTime}
              onChange={(val) => setNewSlotData({ ...newSlotData, startTime: val })}
            />
            <TimeInput
              label="End"
              value={newSlotData.endTime}
              onChange={(val) => setNewSlotData({ ...newSlotData, endTime: val })}
            />
            <div className="flex-center gap-8 mt-12">
              <button className="btn-cancel-small" onClick={() => setIsAddingSlot(false)}>Cancel</button>
              <button className="btn-save-small" onClick={handleAddSlotSubmit}>Add</button>
            </div>
          </div>
        )}

        {!isAddingSlot && !isEditing && slots.length < 4 && (
          <button
            className="btn-add-slot"
            onClick={() => setIsAddingSlot(true)}
          >
            <MdAdd /> Add Slot
          </button>
        )}
      </div>

      <div className="seat-footer mt-16 pt-12" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex-between align-center">
          <span className="text-muted-sm font-600">Available Slots</span>
          <span className={`badge-count ${slots.filter(s => s.status === 'available').length > 0 ? 'badge-count-active' : 'badge-count-inactive'}`}>
            {`${slots.filter(s => s.status === 'available').length} / ${slots.length}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SeatCard;
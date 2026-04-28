import React from 'react';
import { MdEventSeat, MdAccessTime } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import { getSeats } from '@/api/seat.api';

const formatTime = (timeObj) => {
  if (!timeObj) return "";
  return `${timeObj.hour}:${timeObj.minute} ${timeObj.period}`;
};

const SeatSelector = ({ activeDay, selectedSeat, setSelectedSeat, selectedSlot, setSelectedSlot }) => {
  const { data: seatsResponse, isLoading } = useQuery({
    queryKey: ['seats'],
    queryFn: getSeats
  });

  const seats = seatsResponse?.data || [];

  const availableSlots = selectedSeat?.slots?.filter(s => s.day === activeDay) || [];
  const allOccupied = availableSlots.length > 0 && availableSlots.every(s => s.status === 'occupied');

  return (
    <div className="card">
      <h3 className="section-title">
        <MdEventSeat />
        Seat & Slot Selection
      </h3>
      
      <div className="form-group">
        <label className="form-label">Select Seat</label>
        {isLoading ? (
          <div>Loading seats...</div>
        ) : (
          <div className="selection-grid">
            {seats.map(seat => {
              const daySlots = seat.slots.filter(s => s.day === activeDay);
              const fullyBooked = daySlots.length > 0 && daySlots.every(s => s.status === 'occupied');
              return (
                <div 
                  key={seat._id}
                  className={`selectable-item ${selectedSeat?._id === seat._id ? 'selected' : ''} ${fullyBooked ? 'occupied pointer-none cursor-not-allowed' : ''}`}
                  onClick={() => {
                    setSelectedSeat(seat);
                    setSelectedSlot(null);
                  }}
                >
                  {seat.seatNumber}
                  {fullyBooked && (
                    <span className="slot-badge-label">
                      Full
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="form-group mt-lg">
        <label className="form-label">Select Time Slot ({activeDay})</label>
        {!selectedSeat ? (
          <div className="text-muted-sm">Please select a seat first</div>
        ) : availableSlots.length === 0 ? (
          <div className="text-muted-sm">No slots configured for {activeDay}</div>
        ) : allOccupied ? (
          <div className="text-error-sm">
            All slots are occupied for {activeDay}. Choose a different day or seat.
          </div>
        ) : (
          <div className="selection-grid-slots">
            {availableSlots.map(slot => {
              const isOccupied = slot.status === 'occupied';
              return (
                <div 
                  key={slot._id}
                  className={`selectable-item ${selectedSlot?._id === slot._id ? 'selected' : ''} ${isOccupied ? 'occupied pointer-none cursor-not-allowed disabled-bg' : ''}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  <MdAccessTime className="meta-icon-sm" />
                  {formatTime(slot.startTime)}
                  {isOccupied && (
                    <span className="slot-badge-label">
                      Occupied
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatSelector;

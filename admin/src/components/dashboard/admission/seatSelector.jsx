import React from 'react';
import { MdEventSeat, MdAccessTime } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import { getSeats } from '@/api/seat.api';

const formatTime = (timeObj) => {
  if (!timeObj) return "";
  return `${timeObj.hour}:${timeObj.minute} ${timeObj.period}`;
};

const SeatSelector = ({ startDate, endDate, selectedSeat, setSelectedSeat, selectedSlot, setSelectedSlot }) => {
  const { data: seatsResponse, isLoading } = useQuery({
    queryKey: ['seats', startDate, endDate],
    queryFn: () => getSeats({ startDate, endDate }),
    enabled: !!startDate && !!endDate
  });

  const seats = seatsResponse?.data || [];
  
  // Find the selected seat in the fresh data to get updated availability
  const currentSeat = seats.find(s => s._id === selectedSeat?._id);
  const availableSlots = currentSeat?.slots || [];
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
          <div>Loading availability...</div>
        ) : (
          <div className="selection-grid">
            {seats.map(seat => {
              const fullyBooked = seat.slots.length > 0 && seat.slots.every(s => s.status === 'occupied');
              return (
                <div 
                  key={seat._id}
                  className={`selectable-item ${selectedSeat?._id === seat._id ? 'selected' : ''} ${fullyBooked ? 'occupied' : ''}`}
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
        <label className="form-label">Select Time Slot</label>
        {!selectedSeat ? (
          <div className="text-muted-sm">Please select a seat first</div>
        ) : availableSlots.length === 0 ? (
          <div className="text-muted-sm">No slots configured for this seat</div>
        ) : allOccupied ? (
          <div className="text-error-sm">
            All slots are occupied for the selected date range. Choose a different seat.
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

"use client";

import React, { useState } from 'react';
import SeatCard from '../seatCard';
import { MdAdd } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as seatApi from '@/api/seat.api';

const Availability = () => {
  const queryClient = useQueryClient();

  const { data: seatsResponse, isLoading, isError } = useQuery({
    queryKey: ['seats'],
    queryFn: () => seatApi.getSeats(),
  });

  const seats = seatsResponse?.data || [];

  const createSeatMutation = useMutation({
    mutationFn: seatApi.createSeat,
    onSuccess: () => {
      queryClient.invalidateQueries(['seats']);
      toast.success('New seat added');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add seat')
  });

  const updateSeatMutation = useMutation({
    mutationFn: ({ id, name }) => seatApi.updateSeat(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries(['seats']);
      toast.success('Seat updated');
    }
  });

  const deleteSeatMutation = useMutation({
    mutationFn: seatApi.deleteSeat,
    onSuccess: () => {
      queryClient.invalidateQueries(['seats']);
      toast.success('Seat deleted');
    }
  });

  const addSlotMutation = useMutation({
    mutationFn: ({ id, slotData }) => seatApi.addSlot(id, slotData),
    onSuccess: () => {
      queryClient.invalidateQueries(['seats']);
      toast.success('Slot added');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add slot')
  });

  const deleteSlotMutation = useMutation({
    mutationFn: ({ id, slotId }) => seatApi.deleteSlot(id, slotId),
    onSuccess: () => {
      queryClient.invalidateQueries(['seats']);
      toast.success('Slot deleted');
    }
  });

  const handleAddSeat = () => {
    createSeatMutation.mutate();
  };

  const handleAddSlot = (seatId, slotData) => {
    addSlotMutation.mutate({ id: seatId, slotData });
  };

  if (isLoading) return <div className="p-xl">Loading availability...</div>;
  if (isError) return <div className="p-xl text-red-500">Error loading seats</div>;

  return (
    <div className="availability-container">
      <div className="availability-header-row">
        <div className="availability-header">
          <h1>Seat Availability</h1>
          <p>Real-time view of library seats and current slot occupancy.</p>
        </div>
        <button
          className="add-seat-btn"
          onClick={handleAddSeat}
          disabled={createSeatMutation.isPending}
        >
          <MdAdd fontSize="20px" />
          {createSeatMutation.isPending ? 'Adding...' : 'Add New Seat'}
        </button>
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-box available disabled-bg" style={{ border: '2px solid var(--border)' }}></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-box occupied" style={{ background: 'var(--secondary)' }}></div>
          <span>Occupied</span>
        </div>
      </div>

      <div className="seat-grid">
        {seats.map((seat) => (
          <SeatCard
            key={seat._id}
            seatId={seat._id}
            name={seat.seatNumber}
            slots={seat.slots}
            onUpdateSeat={(id, name) => updateSeatMutation.mutate({ id, name })}
            onDeleteSeat={(id) => deleteSeatMutation.mutate(id)}
            onAddSlot={handleAddSlot}
            onDeleteSlot={(id, slotId) => deleteSlotMutation.mutate({ id, slotId })}
          />
        ))}
      </div>
    </div>
  );
};

export default Availability;
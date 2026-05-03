"use client";

import React, { useState } from 'react';
import StudentForm from '../admission/studentForm';
import SeatSelector from '../admission/seatSelector';
import FileUpload from '../admission/fileUpload';
import { MdCheckCircle } from 'react-icons/md';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { admitStudent } from '@/api/student.api';
import { toast } from 'react-hot-toast';

const Admission = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    profileImage: null
  });

  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [docName, setDocName] = useState(null);

  const admissionMutation = useMutation({
    mutationFn: admitStudent,
    onSuccess: () => {
      toast.success('Admission Completed Successfully!');
      queryClient.invalidateQueries(['students']);
      queryClient.invalidateQueries(['seats']);
      queryClient.invalidateQueries(['payments']);
      setFormData({ name: '', phone: '', email: '', address: '', profileImage: null });
      setSelectedSeat(null);
      setSelectedSlot(null);
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate('');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Admission failed');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSeat || !selectedSlot) {
      return toast.error('Please select a seat and slot');
    }

    if (!endDate) {
      return toast.error('Please select an End Date');
    }

    if (new Date(startDate) > new Date(endDate)) {
      return toast.error('Start Date cannot be after End Date');
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('phone', formData.phone);
    data.append('email', formData.email);
    data.append('address', formData.address || '');
    data.append('seatId', selectedSeat._id);
    data.append('slotId', selectedSlot._id);
    data.append('startDate', startDate);
    data.append('endDate', endDate);
    data.append('monthlyCharge', 1500);
    if (formData.profileImage) {
      data.append('profileImage', formData.profileImage);
    }

    admissionMutation.mutate(data);
  };

  return (
    <div className="admission-container">
      <div className="admission-header">
        <h1>Student Admission</h1>
        <p>Enroll a new student by filling out the details and selecting a seat.</p>
      </div>

      <div className="card mb-20">
        <h3 className="section-title">
          Booking Dates
        </h3>
        <div className="form-group-grid">
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input 
              type="date" 
              className="input-field" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">End Date</label>
            <input 
              type="date" 
              className="input-field" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      <form className="admission-grid" onSubmit={handleSubmit}>
        <StudentForm formData={formData} setFormData={setFormData} />

        <SeatSelector
          startDate={startDate}
          endDate={endDate}
          selectedSeat={selectedSeat}
          setSelectedSeat={setSelectedSeat}
          selectedSlot={selectedSlot}
          setSelectedSlot={setSelectedSlot}
        />

        <FileUpload fileName={docName} setFileName={setDocName} />

        <div className="flex-center p-xl">
          <button 
            type="submit" 
            className="btn btn-primary btn-admission" 
            disabled={admissionMutation.isPending}
          >
            <MdCheckCircle fontSize="20px" />
            {admissionMutation.isPending ? 'Processing...' : 'Complete Admission'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Admission;

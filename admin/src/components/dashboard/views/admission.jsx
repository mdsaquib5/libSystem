"use client";

import React, { useState } from 'react';
import StudentForm from '../admission/studentForm';
import SeatSelector from '../admission/seatSelector';
import FeeCalculator from '../admission/feeCalculator';
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

  const [activeDay, setActiveDay] = useState('Mon');
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [months, setMonths] = useState(1);
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
      setMonths(1);
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

    const data = new FormData();
    data.append('name', formData.name);
    data.append('phone', formData.phone);
    data.append('email', formData.email);
    data.append('address', formData.address || '');
    data.append('seatId', selectedSeat._id);
    data.append('slotId', selectedSlot._id);
    data.append('admissionDate', new Date().toISOString());
    data.append('months', months);
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

      <div className="tabs-container mb-20">
        {days.map((day) => (
          <button
            key={day}
            type="button"
            className={`tab-btn ${activeDay === day ? 'active' : ''}`}
            onClick={() => {
              setActiveDay(day);
              setSelectedSlot(null);
            }}
          >
            {day}
          </button>
        ))}
      </div>

      <form className="admission-grid" onSubmit={handleSubmit}>
        <StudentForm formData={formData} setFormData={setFormData} />

        <SeatSelector
          activeDay={activeDay}
          selectedSeat={selectedSeat}
          setSelectedSeat={setSelectedSeat}
          selectedSlot={selectedSlot}
          setSelectedSlot={setSelectedSlot}
        />

        <FeeCalculator months={months} setMonths={setMonths} />

        <FileUpload fileName={docName} setFileName={setDocName} />

        <div className="flex-center p-xl">
          <button 
            type="submit" 
            className="btn btn-primary btn-admission" 
            disabled={admissionMutation.isLoading}
          >
            <MdCheckCircle fontSize="20px" />
            {admissionMutation.isLoading ? 'Processing...' : 'Complete Admission'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Admission;

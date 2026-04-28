import React from 'react';
import { MdPerson, MdPhone, MdEmail, MdLocationOn, MdImage } from 'react-icons/md';

const StudentForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="card">
      <h3 className="section-title">
        <MdPerson />
        Student Details
      </h3>
      <div className="form-group-grid">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input 
            type="text" 
            placeholder="Enter student name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input 
            type="tel" 
            name="phone" 
            placeholder="+1 234 567 890" 
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input 
            type="email" 
            name="email" 
            placeholder="john@example.com" 
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Address</label>
          <input 
            type="text" 
            name="address" 
            placeholder="123 Street, City" 
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Profile Image</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setFormData(prev => ({ ...prev, profileImage: e.target.files[0] || null }))}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentForm;

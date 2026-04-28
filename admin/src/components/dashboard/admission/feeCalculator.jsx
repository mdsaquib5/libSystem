import React from 'react';
import { MdPayments } from 'react-icons/md';

const FeeCalculator = ({ months, setMonths, monthlyCharge = 1500 }) => {
  const totalAmount = monthlyCharge * (parseInt(months) || 0);

  return (
    <div className="card">
      <h3 className="section-title">
        <MdPayments />
        Fee Calculation
      </h3>
      
      <div className="form-group-grid">
        <div className="form-group">
          <label className="form-label">Monthly Charge</label>
          <input type="text" value={`₹${monthlyCharge}`} disabled className="disabled-bg" />
        </div>
        <div className="form-group">
          <label className="form-label">Number of Months</label>
          <input 
            type="number" 
            min="1" 
            value={months} 
            onChange={(e) => setMonths(e.target.value)}
            placeholder="e.g. 3"
          />
        </div>
      </div>

      <div className="fee-summary">
        <span className="total-label">Total Payable Amount</span>
        <span className="total-value">₹{totalAmount.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default FeeCalculator;

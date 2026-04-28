import React from 'react';

const TimeInput = ({ label, value, onChange }) => {
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];
  const periods = ['AM', 'PM'];

  const handleSelectChange = (field, newValue) => {
    onChange({ ...value, [field]: newValue });
  };

  return (
    <div className="time-row">
      <span className="time-label">{label}</span>
      <div className="time-picker-group">
        <select 
          className="time-picker-select" 
          value={value.hour}
          onChange={(e) => handleSelectChange('hour', e.target.value)}
        >
          {hours.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
        <span className="time-picker-divider">:</span>
        <select 
          className="time-picker-select"
          value={value.minute}
          onChange={(e) => handleSelectChange('minute', e.target.value)}
        >
          {minutes.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select 
          className="time-picker-select"
          value={value.period}
          onChange={(e) => handleSelectChange('period', e.target.value)}
        >
          {periods.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
    </div>
  );
};

export default TimeInput;

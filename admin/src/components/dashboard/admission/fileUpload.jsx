import React from 'react';
import { MdCloudUpload, MdInsertDriveFile } from 'react-icons/md';

const FileUpload = ({ fileName, setFileName }) => {
  return (
    <div className="card">
      <h3 className="section-title">
        <MdCloudUpload />
        Document Upload
      </h3>
      
      <div className="file-upload-wrapper">
        <p className="form-label" style={{ textAlign: 'center', marginBottom: 'var(--space-sm)' }}>
          Upload Student ID (PDF)
        </p>
        <input 
          type="file" 
          accept=".pdf"
          onChange={(e) => setFileName(e.target.files[0]?.name)}
          style={{ width: 'auto', margin: '0 auto' }}
        />
        {fileName && (
          <div className="file-info">
            <MdInsertDriveFile style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            {fileName}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;

import React, { useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { FileList } from '../components/FileList';

export function Upload() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      <section className="text-center space-y-4 mb-8">
        <h1 className="text-3xl font-bold text-white">Upload Files</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Drag and drop your files or click to browse. Your files will be encrypted
          and stored securely.
        </p>
      </section>

      <FileUpload onUploadComplete={handleUploadComplete} />
      <FileList refreshTrigger={refreshTrigger} />
    </div>
  );
}
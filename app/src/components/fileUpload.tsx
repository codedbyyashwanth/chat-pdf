import { useState } from 'react';
import { uploadFile } from '@/services/file-upload';

export const UploadPdf = () => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await uploadFile(file);
      alert('File uploaded successfully!');
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    }
    setIsUploading(false);
  };

  return (
    <div>
      <input 
        type="file" 
        accept="application/pdf" 
        onChange={handleUpload}
        disabled={isUploading}
      />
      {isUploading && <p>Uploading...</p>}
    </div>
  );
};
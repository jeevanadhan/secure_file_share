import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onUploadComplete: () => void;
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    try {
      for (const file of acceptedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).slice(2)}-${file.name}`;

        const { error } = await supabase.storage
          .from('files')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) throw error;
        toast.success(`Uploaded ${file.name}`);
      }
      onUploadComplete(); // Trigger file list refresh
    } catch (error) {
      toast.error('Error uploading file');
      console.error('Error:', error);
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    disabled: uploading,
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all
        ${isDragActive ? 'border-blue-500 bg-blue-50/5' : 'border-gray-600 hover:border-gray-500'}
        ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
      ) : (
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
      )}
      <p className="mt-2 text-sm text-gray-300">
        {uploading
          ? 'Uploading...'
          : isDragActive
          ? 'Drop the files here...'
          : 'Drag & drop files here, or click to select files'}
      </p>
      <p className="mt-1 text-xs text-gray-400">
        Maximum file size: 50MB
      </p>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, FileIcon, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface CustomFileObject {
  name: string;
  size?: number;
  created_at?: string;
}

interface FileListProps {
  refreshTrigger: number;
  onFileSelect: (fileName: string) => void;
  selectedFile: string | null;
}

export function FileList({ refreshTrigger, onFileSelect, selectedFile }: FileListProps) {
  const [files, setFiles] = useState<CustomFileObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFiles();
  }, [refreshTrigger]);

  const loadFiles = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const { data, error } = await supabase.storage.from('files').list();
      if (error) throw error;

      const detailedFiles: CustomFileObject[] = data.map((file) => ({
        name: file.name,
        size: file.metadata?.size || 0,
        created_at: file.metadata?.created_at || '',
      }));
      
      setFiles(detailedFiles);
    } catch (error) {
      toast.error('Error loading files');
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const deleteFile = async (name: string) => {
    setDeleting(name);
    try {
      // Delete file from storage
      const { error: fileError } = await supabase.storage.from('files').remove([name]);
      if (fileError) throw fileError;

      // Delete associated share links
      const { error: shareError } = await supabase
        .from('share_links')
        .delete()
        .eq('file_path', name);
      if (shareError) throw shareError;

      toast.success('File and associated share links deleted');
      setFiles(files.filter(f => f.name !== name));
    } catch (error) {
      toast.error('Error deleting file or share links');
      console.error('Error:', error);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <FileIcon className="h-5 w-5" />
          Your Files
        </h2>
        <button
          onClick={loadFiles}
          disabled={refreshing}
          className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
          </div>
        ) : files.length === 0 ? (
          <p className="text-gray-400 p-8 text-center">
            No files uploaded yet. Start by uploading some files!
          </p>
        ) : (
          <ul className="divide-y divide-gray-700">
            {files.map((file) => (
              <li
                key={file.name}
                className={`p-4 hover:bg-gray-700/50 transition-colors cursor-pointer rounded-lg ${
                  selectedFile === file.name ? 'bg-gray-700' : ''
                }`}
                onClick={() => onFileSelect(file.name)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-400">
                        {file.size ? `${(file.size / 1024).toFixed(2)} KB` : 'Unknown size'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => deleteFile(file.name)}
                      disabled={deleting === file.name}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-full transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      {deleting === file.name ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

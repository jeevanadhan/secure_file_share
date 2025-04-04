import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Download as DownloadIcon, Shield, Loader2, Key } from 'lucide-react';
import toast from 'react-hot-toast';

interface ShareLink {
  id: string;
  file_path: string;
  expires_at: string;
  otp: string | number;
  otp_expires_at: string;
  otp_used: boolean;
}

export function Download() {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const [shareLink, setShareLink] = useState<ShareLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    loadShareLink();
  }, [shareId]);

  const loadShareLink = async () => {
    try {
      const { data, error } = await supabase
        .from('share_links')
        .select('*')
        .eq('id', shareId)
        .single();

      if (error) throw error;

      const now = new Date();
      if (new Date(data.expires_at) < now) {
        await supabase.from('share_links').delete().eq('id', shareId);
        toast.error('This share link has expired');
        navigate('/');
        return;
      }

      if (data.otp_used) {
        toast.error('This OTP has already been used');
        navigate('/');
        return;
      }

      if (new Date(data.otp_expires_at) < now) {
        toast.error('OTP has expired. Request a new link.');
        navigate('/');
        return;
      }

      setShareLink(data);
    } catch (error) {
      toast.error('Invalid or expired share link');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!shareLink) return;

    const entered = otp.trim();
    const stored = String(shareLink.otp || '').trim();

    if (entered === stored) {
      await supabase.from('share_links').update({ otp_used: true }).eq('id', shareId);
      toast.success('OTP Verified!');
      setIsVerified(true);
    } else {
      toast.error('Invalid OTP. Please try again.');
    }
  };

  const downloadFile = async () => {
    if (!shareLink) return;

    setDownloading(true);
    try {
      const { data, error } = await supabase.storage
        .from('files')
        .download(shareLink.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = shareLink.file_path.split('-').slice(1).join('-');
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Download started');
    } catch (error) {
      toast.error('Error downloading file');
      console.error('Error details:', error);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900 bg-opacity-90">
      <div className="max-w-md w-full rounded-xl shadow-2xl p-8 bg-gray-800/50">
        <h2 className="text-2xl font-bold text-center text-white mb-2">Secure File Download</h2>
        {shareLink && (
          <>
            <p className="text-center text-gray-400 mb-8">
              You're about to download: {shareLink.file_path.split('-').slice(1).join('-')}
            </p>
            {!isVerified ? (
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button onClick={verifyOTP} className="w-full px-4 py-3 bg-green-500 text-white rounded-lg">Verify OTP</button>
              </div>
            ) : (
              <button onClick={downloadFile} disabled={downloading} className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg">
                {downloading ? 'Starting Download...' : 'Download File'}
              </button>
            )}
            <p className="text-center text-sm text-gray-400 mt-4">This link will expire on {new Date(shareLink.expires_at).toLocaleString()}</p>
          </>
        )}
      </div>
    </div>
  );
}
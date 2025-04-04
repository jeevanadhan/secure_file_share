import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FileList } from '../components/FileList';
import { Clock, Copy, Link as LinkIcon, Mail, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import emailjs from '@emailjs/browser';

interface ShareLink {
  id: string;
  file_path: string;
  expires_at: string;
  created_at: string;
  recipient_email: string;
  otp: string;
  otp_expires_at: string;
  otp_verified: boolean;
}

export function Share() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [expiryHours, setExpiryHours] = useState(24);
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadShareLinks();
  }, []);

  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

  const loadShareLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('share_links')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShareLinks(data || []);
    } catch (error) {
      toast.error('Error loading share links');
      console.error('Error:', error);
    }
  };

  const sendOTPEmail = async (recipientEmail: string, otp: string, expiryTime: string, shareLink: string) => {
    try {
      const result = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          email: recipientEmail,
          otp: otp,
          time: expiryTime,
          sharelink: shareLink,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      console.log('✅ Email sent:', result.text);
    } catch (error: any) {
      console.error('❌ Failed to send email:', error);
      toast.error(`Error sending email: ${error.text || error}`);
    }
  };

  const createShareLink = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to share');
      return;
    }
    if (!recipientEmail) {
      toast.error('Please enter recipient email');
      return;
    }

    setLoading(true);
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + expiryHours);
      const otp = generateOTP();
      const otpExpiresAt = new Date();
      otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 10);

      // Insert file share link with OTP and recipient email
      const { data: linkData, error: linkError } = await supabase
        .from('share_links')
        .insert([
          {
            file_path: selectedFile,
            expires_at: expiresAt.toISOString(),
            recipient_email: recipientEmail, // ✅ Storing recipient email
            otp, // ✅ Storing OTP inside share_links
            otp_expires_at: otpExpiresAt.toISOString(),
            otp_verified: false, // ✅ Initially not verified
          },
        ])
        .select()
        .single();

      if (linkError) throw linkError;
      const shareLink = `${window.location.origin}/download/${linkData.id}`;

      await sendOTPEmail(recipientEmail, otp, otpExpiresAt.toLocaleString(), shareLink);

      setShareLinks([linkData, ...shareLinks]);
      toast.success(`Share link created. OTP sent to ${recipientEmail}`);
      setSelectedFile(null);
      setRecipientEmail('');
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      toast.error('Error creating share link');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="text-center space-y-4 mb-8">
        <h1 className="text-3xl font-bold text-white">Share Files</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Create secure, time-limited share links for your files with OTP verification.
        </p>
      </section>

      <div className="bg-gray-800/50 rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-semibold text-white">Create Share Link</h2>
        <FileList refreshTrigger={refreshTrigger} onFileSelect={setSelectedFile} selectedFile={selectedFile} />
        <input
          type="email"
          placeholder="Recipient's Email"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
        />
        <select
          value={expiryHours}
          onChange={(e) => setExpiryHours(Number(e.target.value))}
          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
        >
          <option value={1}>1 hour</option>
          <option value={24}>24 hours</option>
          <option value={72}>3 days</option>
          <option value={168}>7 days</option>
        </select>
        <button
          onClick={createShareLink}
          disabled={loading || !selectedFile || !recipientEmail}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LinkIcon className="h-5 w-5" />}
          Create Share Link with OTP
        </button>
      </div>
    </div>
  );
}

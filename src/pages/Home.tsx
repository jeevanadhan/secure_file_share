import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Share, Shield } from 'lucide-react';

export function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          Welcome to Secure File Sharing
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Share your files securely with customizable expiry times and protected downloads.
        </p>
      </section>

      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <div className="bg-gray-800/50 rounded-xl p-6 space-y-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Upload className="h-6 w-6 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-white">Upload Files</h3>
          <p className="text-gray-400">
            Securely upload your files with end-to-end encryption.
          </p>
          <Link
            to="/upload"
            className="inline-block mt-4 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
          >
            Start Uploading
          </Link>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 space-y-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Share className="h-6 w-6 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-white">Share Files</h3>
          <p className="text-gray-400">
            Generate secure share links with custom expiry times.
          </p>
          <Link
            to="/share"
            className="inline-block mt-4 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
          >
            Share Files
          </Link>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 space-y-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Shield className="h-6 w-6 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-white">Secure Access</h3>
          <p className="text-gray-400">
            Control access to your files with expiring links and download tracking.
          </p>
          <Link
            to="/about"
            className="inline-block mt-4 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
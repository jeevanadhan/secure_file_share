import React from 'react';
import { Shield, Lock, Clock, Users } from 'lucide-react';

export function About() {
  return (
    <div className="space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">About Our Service</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          We provide a secure and reliable way to share your files with others,
          ensuring your data remains protected at all times.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-8 mt-12">
        <div className="bg-gray-800/50 rounded-xl p-6 space-y-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Shield className="h-6 w-6 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-white">End-to-End Security</h3>
          <p className="text-gray-400">
            Your files are encrypted during transfer and storage, ensuring maximum
            security for your sensitive data.
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 space-y-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Lock className="h-6 w-6 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-white">Access Control</h3>
          <p className="text-gray-400">
            Control who can access your files with secure sharing links and
            optional password protection.
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 space-y-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Clock className="h-6 w-6 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-white">Expiring Links</h3>
          <p className="text-gray-400">
            Set expiration times for shared links to ensure temporary access
            and better security.
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 space-y-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Users className="h-6 w-6 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-white">User Management</h3>
          <p className="text-gray-400">
            Create an account to manage your files, track sharing history,
            and control access permissions.
          </p>
        </div>
      </div>

      <section className="bg-gray-800/50 rounded-xl p-8 mt-12">
        <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
        <p className="text-gray-400 leading-relaxed">
          We believe in making file sharing both secure and simple. Our platform
          is designed to provide enterprise-level security while maintaining an
          intuitive user experience. Whether you're sharing sensitive documents
          or collaborating on projects, we ensure your data remains protected
          without compromising on convenience.
        </p>
      </section>
    </div>
  );
}
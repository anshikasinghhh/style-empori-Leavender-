import React, { useState } from 'react';
import EmployeeLayout from './EmployeeLayout';
import { User, Lock, Save, ShieldCheck } from 'lucide-react';
import { useSelector } from 'react-redux';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function EmployeeProfile() {
  const { user } = useSelector(s => s.auth);
  
  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updating, setUpdating] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setUpdating(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password update failed');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <EmployeeLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="font-body text-gray-500 text-sm mt-0.5">Manage your personal settings and password security</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Info card */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-6 border-b border-gray-50 pb-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-gradient flex items-center justify-center text-white text-2xl font-bold shadow-md">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-gray-900">{user?.name}</h3>
                <p className="font-body text-xs text-gray-400">Team Role: Employee / Staff</p>
              </div>
            </div>

            <div className="space-y-4 font-body text-sm">
              <div>
                <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Email Address</span>
                <span className="text-gray-800 font-semibold">{user?.email}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Contact Number</span>
                <span className="text-gray-800 font-semibold">{user?.phone || 'Not Provided'}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">System Access Role</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold font-bold text-xs border border-gold/25 mt-1">
                  <ShieldCheck size={13} /> {user?.role?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-gray-400 font-body">
            Account created on {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Change password card */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50">
          <h3 className="font-display font-bold text-gray-900 text-lg mb-1 flex items-center gap-2">
            <Lock size={18} className="text-primary" /> Update Password
          </h3>
          <p className="font-body text-xs text-gray-400 mb-5">Change your login credentials below</p>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs font-body font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Current Password *</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="input-field py-2.5 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-body font-bold text-gray-700 mb-1.5 uppercase tracking-wide">New Password *</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="input-field py-2.5 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-body font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Confirm New Password *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="input-field py-2.5 text-sm"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={updating}
                className="w-full btn-primary py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <Save size={14} /> {updating ? 'Updating...' : 'Save Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </EmployeeLayout>
  );
}

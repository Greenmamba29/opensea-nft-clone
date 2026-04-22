"use client";

import React, { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const sidebarLinks = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'notifications', label: 'Email Notifications', icon: '🔔' },
    { id: 'developer', label: 'Developer', icon: '🛠️' },
    { id: 'verification', label: 'Verification', icon: '✓' },
    { id: 'language', label: 'Language', icon: '🌐' },
    { id: 'shortcuts', label: 'Shortcuts', icon: '⌨️' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[var(--os-bg)] text-[var(--os-text)]">
      <div className="px-8 pt-12 pb-8 border-b border-[var(--os-border)]">
        <h1 className="text-3xl font-black tracking-tight">Settings</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-[var(--os-border)] overflow-y-auto p-6 hidden lg:block">
          <div className="space-y-1">
            {sidebarLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === link.id ? 'bg-[var(--os-surface-2)] text-[var(--os-text)] shadow-sm' : 'text-[var(--os-text-secondary)] hover:bg-[var(--os-surface-2)] hover:text-[var(--os-text)]'}`}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-black mb-8">Edit Profile</h2>

          <div className="space-y-12">
            {/* Banner & Avatar Section */}
            <div className="space-y-6">
              <div className="relative group">
                <div className="h-48 rounded-2xl bg-gradient-to-r from-[var(--os-blue)] via-purple-600 to-[var(--os-red)] w-full overflow-hidden">
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm">
                    <span className="bg-white/20 px-4 py-2 rounded-xl text-sm font-bold border border-white/30">Edit Cover Photo</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-8 left-8 w-32 h-32 rounded-3xl border-4 border-[var(--os-bg)] bg-[var(--os-surface-2)] shadow-2xl overflow-hidden flex items-center justify-center text-4xl group/avatar">
                  👤
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm">
                    <span className="text-sm">✎</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-8 mt-16">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-[var(--os-text-secondary)]">Username</label>
                <input 
                  type="text" 
                  defaultValue="0xdeaf...fb8b"
                  placeholder="Enter username" 
                  className="w-full bg-[var(--os-surface-2)] border border-[var(--os-border)] rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:border-[var(--os-blue)] focus:ring-1 focus:ring-[var(--os-blue)] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-[var(--os-text-secondary)]">Bio</label>
                <textarea 
                  rows={4}
                  placeholder="Tell the world about yourself" 
                  className="w-full bg-[var(--os-surface-2)] border border-[var(--os-border)] rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:border-[var(--os-blue)] focus:ring-1 focus:ring-[var(--os-blue)] transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-[var(--os-text-secondary)]">URL</label>
                <input 
                  type="text" 
                  placeholder="https://yoursite.io" 
                  className="w-full bg-[var(--os-surface-2)] border border-[var(--os-border)] rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:border-[var(--os-blue)] focus:ring-1 focus:ring-[var(--os-blue)] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-[var(--os-text-secondary)]">Email Address</label>
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <input 
                      type="email" 
                      placeholder="email@example.com" 
                      className="w-full bg-[var(--os-surface-2)] border border-[var(--os-border)] rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:border-[var(--os-blue)] focus:ring-1 focus:ring-[var(--os-blue)] transition-all"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <span className="bg-[var(--os-red)]/20 text-[var(--os-red)] text-[10px] font-black uppercase px-2 py-1 rounded border border-[var(--os-red)]/30">UNVERIFIED</span>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-[var(--os-surface-3)] border border-[var(--os-border)] rounded-xl text-sm font-bold hover:bg-[var(--os-surface-2)] transition-all">Edit</button>
                </div>
                <button className="text-xs font-bold text-[var(--os-blue)] hover:underline mt-2">Resend verification email</button>
              </div>
            </div>

            {/* Social Connections */}
            <div className="space-y-6 pt-8 border-t border-[var(--os-border)]">
              <h3 className="text-lg font-black">Social Connections</h3>
              <p className="text-sm text-[var(--os-text-secondary)] font-medium">Connect your social accounts to display them on your profile.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="flex items-center justify-between p-4 bg-[var(--os-surface-2)] border border-[var(--os-border)] rounded-2xl hover:bg-[var(--os-surface-3)] transition-all group">
                  <div className="flex items-center space-x-4">
                    <span className="text-xl">𝕏</span>
                    <span className="text-sm font-bold">Twitter</span>
                  </div>
                  <span className="text-[var(--os-blue)] text-sm font-bold group-hover:translate-x-1 transition-transform">Connect →</span>
                </button>
                <button className="flex items-center justify-between p-4 bg-[var(--os-surface-2)] border border-[var(--os-border)] rounded-2xl hover:bg-[var(--os-surface-3)] transition-all group">
                  <div className="flex items-center space-x-4">
                    <span className="text-xl">👾</span>
                    <span className="text-sm font-bold">Discord</span>
                  </div>
                  <span className="text-[var(--os-blue)] text-sm font-bold group-hover:translate-x-1 transition-transform">Connect →</span>
                </button>
              </div>
            </div>

            <button className="w-full py-4 bg-[var(--os-blue)] text-white rounded-2xl font-black text-lg hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[var(--os-surface-3)] border border-[var(--os-border-light)] px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-4 animate-bounce-in z-50">
        <div className="w-6 h-6 bg-[var(--os-green)] rounded-full flex items-center justify-center text-xs">✓</div>
        <p className="text-sm font-bold">Saved. Check your inbox for a verification email.</p>
        <button className="text-[var(--os-text-tertiary)] hover:text-white transition-colors ml-4 text-xs font-bold uppercase tracking-wider">Dismiss</button>
      </div>
    </div>
  );
}

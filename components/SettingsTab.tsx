import React, { useState, useRef } from 'react';
import { Stage, User } from '../types';
import StageManager from './StageManager';
import { ArrowPathIcon, CheckBadgeIcon } from './icons/Icons';
import EditProfileModal from './EditProfileModal';

interface SettingsTabProps {
  stages: Stage[];
  onSetStages: (stages: Stage[]) => void;
  language: 'en' | 'id';
  onLanguageChange: (lang: 'en' | 'id') => void;
  onResetData: () => void;
  user?: User;
  onUpdateUser?: (updatedUser: User) => void;
  addToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  stages,
  onSetStages,
  language,
  onLanguageChange,
  onResetData,
  user,
  onUpdateUser,
  addToast
}) => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const restoreFileRef = useRef<HTMLInputElement>(null);

  const isId = language === 'id';

  const handleBackup = () => {
    try {
      const companyName = user?.companyName || user?.company_name || user?.name || 'Perusahaan Klien';
      const companyId = user?.id || 'client-company';
      const isSuper = user?.role === 'super_admin';

      const backupData: Record<string, any> = {
        _metadata: {
          platform: 'TalentStream ATS',
          company_name: companyName,
          company_id: companyId,
          exported_by: user?.email || 'admin',
          exported_at: new Date().toISOString(),
          is_super_admin: isSuper
        }
      };

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('ts_')) {
          try {
            backupData[key] = JSON.parse(localStorage.getItem(key) || '');
          } catch {
            backupData[key] = localStorage.getItem(key);
          }
        }
      }

      // If client admin, strictly scope the backup to this company only
      if (!isSuper) {
        if (Array.isArray(backupData['ts_jobs'])) {
          backupData['ts_jobs'] = backupData['ts_jobs'].filter((j: any) => (j.companyId || j.company_id) === companyId);
        }
        const allowedJobIds = new Set(Array.isArray(backupData['ts_jobs']) ? backupData['ts_jobs'].map((j: any) => j.id) : []);
        if (Array.isArray(backupData['ts_applications'])) {
          backupData['ts_applications'] = backupData['ts_applications'].filter((a: any) => (a.companyId || a.company_id) === companyId || allowedJobIds.has(a.jobId));
        }
        const allowedCandidateIds = new Set(Array.isArray(backupData['ts_applications']) ? backupData['ts_applications'].map((a: any) => a.candidateId) : []);
        if (Array.isArray(backupData['ts_candidates'])) {
          backupData['ts_candidates'] = backupData['ts_candidates'].filter((c: any) => allowedCandidateIds.has(c.id) || (c.companyId || c.company_id) === companyId);
        }
        if (Array.isArray(backupData['ts_requisitions'])) {
          backupData['ts_requisitions'] = backupData['ts_requisitions'].filter((r: any) => (r.companyId || r.company_id) === companyId || !r.companyId);
        }
        if (Array.isArray(backupData['ts_projects'])) {
          backupData['ts_projects'] = backupData['ts_projects'].filter((p: any) => (p.companyId || p.company_id) === companyId || !p.companyId);
        }
      }

      const safeCompName = companyName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `talentstream_${safeCompName}_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      if (addToast) {
        addToast(isId ? 'Cadangan data rekrutmen berhasil diunduh!' : 'Recruitment backup data downloaded successfully!', 'success');
      }
    } catch (err: any) {
      if (addToast) {
        addToast(isId ? 'Gagal mencadangkan data: ' + err.message : 'Failed to backup data: ' + err.message, 'error');
      }
    }
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (typeof parsed !== 'object' || parsed === null) {
          throw new Error('Format file JSON tidak valid');
        }

        Object.keys(parsed).forEach((key) => {
          if (key === '_metadata') return;
          const val = typeof parsed[key] === 'string' ? parsed[key] : JSON.stringify(parsed[key]);
          localStorage.setItem(key, val);
        });

        if (addToast) {
          addToast(isId ? 'Data berhasil dipulihkan! Memuat ulang halaman...' : 'Data restored successfully! Reloading...', 'success');
        }
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } catch (err: any) {
        if (addToast) {
          addToast(isId ? 'Gagal memulihkan: Format file cadangan tidak valid.' : 'Failed to restore: Invalid backup file format.', 'error');
        }
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto pb-20">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          {isId ? 'Pengaturan' : 'Settings'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          {isId ? 'Konfigurasi profil, alur rekrutmen, dan preferensi ruang kerja TalentStream Anda.' : 'Configure your TalentStream profile, recruitment workflow, and workspace preferences.'}
        </p>
      </div>

      {/* 1. Profile Section */}
      {user && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
              <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3>{isId ? 'Profil Pengguna' : 'User Profile'}</h3>
            </div>
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-600/20 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>{isId ? 'Edit Profil' : 'Edit Profile'}</span>
            </button>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={user.avatarUrl || user.avatar_url || `https://picsum.photos/seed/${encodeURIComponent(user.name)}/120`}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover ring-4 ring-slate-100 dark:ring-slate-800 shadow-md"
            />
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h4>
                <span className="inline-block px-2.5 py-0.5 text-xs font-bold uppercase rounded-full bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 w-fit mx-auto sm:mx-0">
                  {user.subscription?.type || 'Free'} Plan
                </span>
                <span className="inline-block px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 w-fit mx-auto sm:mx-0">
                  {user.role === 'super_admin' ? 'Super Admin' : 'Client Admin'}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-1 gap-x-4 text-sm text-slate-500 dark:text-slate-400">
                <span>📧 {user.email}</span>
                {user.phone && <span>📱 {user.phone}</span>}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Preferences */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
            <CheckBadgeIcon className="w-5 h-5 text-primary-600" />
            <h3>{isId ? 'Preferensi Tampilan' : 'Display Preferences'}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                  {isId ? 'Bahasa Antarmuka' : 'Language'}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  {isId ? 'Pilih bahasa tampilan sistem yang Anda sukai.' : 'Choose your preferred interface language.'}
                </p>
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
                    <button
                        onClick={() => onLanguageChange('en')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${language === 'en' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => onLanguageChange('id')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${language === 'id' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        Bahasa Indonesia
                    </button>
                </div>
            </div>
        </div>
      </section>

      {/* 3. Stage Manager */}
      <StageManager stages={stages} onSetStages={onSetStages} />

      {/* 4. Backup & Restore Data */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <h3>{isId ? 'Pencadangan & Pemulihan Data (Backup & Restore)' : 'Backup & Restore Data'}</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Backup Card */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                    {isId ? 'Cadangkan Data Perusahaan (Backup)' : 'Export Company Backup'}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    {isId 
                      ? 'Unduh riwayat lowongan, pelamar, dan alur kerja Anda sebagai file JSON cadangan aman.' 
                      : 'Download all jobs, applicants, and pipeline records as a secure JSON file.'}
                  </p>
                </div>
                <button
                    onClick={handleBackup}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-semibold rounded-xl transition-all shadow-md"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>{isId ? 'Unduh Backup (.JSON)' : 'Download Backup (.JSON)'}</span>
                </button>
            </div>

            {/* Restore Card */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                    {isId ? 'Pulihkan Data (Restore)' : 'Restore Data from File'}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    {isId ? 'Unggah file cadangan JSON yang telah Anda unduh sebelumnya untuk memulihkan data ruang kerja perusahaan Anda.' : 'Upload a previously saved JSON backup file to restore your company workspace data.'}
                  </p>
                </div>
                
                <input 
                  type="file" 
                  ref={restoreFileRef} 
                  accept=".json,application/json" 
                  onChange={handleRestore} 
                  className="hidden" 
                />

                <button
                    onClick={() => restoreFileRef.current?.click()}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-primary-600/20"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>{isId ? 'Pilih File Restore (.JSON)' : 'Select Backup File (.JSON)'}</span>
                </button>
            </div>
        </div>
      </section>

      {/* 5. Danger Zone */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-lg font-semibold text-red-600 border-b border-red-100 dark:border-red-900/30 pb-2">
            <ArrowPathIcon className="w-5 h-5" />
            <h3>{isId ? 'Zona Berbahaya (Danger Zone)' : 'Danger Zone'}</h3>
        </div>
        <div className="p-6 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h4 className="font-bold text-red-900 dark:text-red-400">
                      {isId ? 'Reset Seluruh Data Aplikasi' : 'Reset Application Data'}
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-500/80">
                      {isId ? 'Tindakan ini akan menghapus semua data lokal dan mengembalikan data bawaan sampel. Tindakan ini tidak dapat dibatalkan.' : 'This will clear all your local data and restore default sample data. This action cannot be undone.'}
                    </p>
                </div>
                <button
                    onClick={() => {
                        const confirmMsg = isId ? 'Apakah Anda yakin ingin mereset seluruh data? Semua data penyimpanan lokal akan dihapus.' : 'Are you sure you want to reset all data? This will clear your local storage.';
                        if (window.confirm(confirmMsg)) {
                            onResetData();
                        }
                    }}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-600/20 whitespace-nowrap"
                >
                    {isId ? 'Reset Seluruh Data' : 'Reset All Data'}
                </button>
            </div>
        </div>
      </section>

      {/* Edit Profile Modal */}
      {user && isEditProfileOpen && (
        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          user={user}
          onUpdateUser={onUpdateUser || (() => {})}
          language={language}
          addToast={addToast}
        />
      )}
    </div>
  );
};

export default SettingsTab;

import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { apiGetAdminUsers, apiUpdateAdminUser, apiDeleteAdminUser, apiRestoreAdminUser } from '../services/api';
import { ArrowPathIcon, UsersIcon } from './icons/Icons';
import { Search, Shield, Building2, Trash2, CheckCircle, Sparkles, RotateCcw, Archive } from 'lucide-react';

interface SuperAdminUserManagementProps {
  language: 'en' | 'id';
  currentUser: User;
  addToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

const SuperAdminUserManagement: React.FC<SuperAdminUserManagementProps> = ({
  language,
  currentUser,
  addToast
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'super_admin' | 'admin'>('all');
  const [filterPlan, setFilterPlan] = useState<'all' | 'free' | 'pro' | 'enterprise'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'archived'>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const isId = language === 'id';

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await apiGetAdminUsers();
      if (data) {
        setUsers(data);
      }
    } catch (err: any) {
      if (addToast) addToast(isId ? 'Gagal memuat daftar pengguna' : 'Failed to load users', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'super_admin') {
      loadUsers();
    }
    const handleRefresh = () => {
      if (currentUser?.role === 'super_admin') loadUsers();
    };
    window.addEventListener('adminUsersRefresh', handleRefresh);
    return () => window.removeEventListener('adminUsersRefresh', handleRefresh);
  }, [currentUser]);

  if (currentUser?.role !== 'super_admin') {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-red-200 dark:border-red-900/40 max-w-lg mx-auto my-8">
        <p className="text-red-600 font-semibold">{isId ? 'Akses Ditolak: Hanya Super Administrator yang berwenang.' : 'Access Denied: Super Administrator only.'}</p>
      </div>
    );
  }

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'super_admin') => {
    setProcessingId(userId);
    try {
      const updated = await apiUpdateAdminUser(userId, { role: newRole });
      if (updated) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        if (addToast) addToast(isId ? `Peran berhasil diubah menjadi ${newRole === 'super_admin' ? 'Super Admin' : 'Client Admin'}` : `Role updated to ${newRole}`, 'success');
        window.dispatchEvent(new Event('adminUsersRefresh'));
      }
    } catch (err: any) {
      if (addToast) addToast(isId ? 'Gagal mengubah peran: ' + err.message : 'Failed to update role', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handlePlanChange = async (userId: string, newPlan: 'free' | 'pro' | 'enterprise') => {
    setProcessingId(userId);
    try {
      const targetUser = users.find(u => u.id === userId);
      const updatedSub = {
        ...(targetUser?.subscription || { status: 'active', expiryDate: new Date().toISOString() }),
        type: newPlan
      };
      const updated = await apiUpdateAdminUser(userId, { subscription: updatedSub as any });
      if (updated) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, subscription: updatedSub as any } : u));
        if (addToast) addToast(isId ? `Paket berhasil diubah ke ${newPlan.toUpperCase()}` : `Plan changed to ${newPlan.toUpperCase()}`, 'success');
        window.dispatchEvent(new Event('adminUsersRefresh'));
      }
    } catch (err: any) {
      if (addToast) addToast(isId ? 'Gagal mengubah paket: ' + err.message : 'Failed to update plan', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  // Opsi B: Soft Delete / Archive
  const handleArchive = async (userId: string, userName: string) => {
    if (userId === currentUser.id) {
      if (addToast) addToast(isId ? 'Tidak dapat mengarsipkan akun Anda sendiri.' : 'Cannot archive your own account.', 'error');
      return;
    }

    setProcessingId(userId);
    try {
      const success = await apiDeleteAdminUser(userId);
      if (success) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'archived' } : u));
        if (addToast) addToast(isId ? `Akun "${userName}" berhasil diarsipkan (Soft Delete). Data pelamar tersimpan aman.` : `Client account "${userName}" archived (Soft Delete). Candidate data preserved safely.`, 'success');
      }
    } catch (err: any) {
      if (addToast) addToast(isId ? 'Gagal mengarsipkan akun' : 'Failed to archive account', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  // Restore archived user
  const handleRestore = async (userId: string, userName: string) => {
    setProcessingId(userId);
    try {
      const success = await apiRestoreAdminUser(userId);
      if (success) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'active' } : u));
        if (addToast) addToast(isId ? `Akun "${userName}" berhasil dipulihkan (Aktif kembali).` : `Client account "${userName}" restored successfully.`, 'success');
      }
    } catch (err: any) {
      if (addToast) addToast(isId ? 'Gagal memulihkan akun' : 'Failed to restore account', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  // Filtered users
  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (u.companyName || u.company_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'all' || 
                      (filterRole === 'super_admin' ? u.role === 'super_admin' : u.role !== 'super_admin');
    const matchPlan = filterPlan === 'all' || u.subscription?.type === filterPlan;
    const matchStatus = filterStatus === 'all' || (filterStatus === 'archived' ? u.status === 'archived' : u.status !== 'archived');
    return matchSearch && matchRole && matchPlan && matchStatus;
  });

  const totalUsers = users.length;
  const activeCount = users.filter(u => u.status !== 'archived').length;
  const archivedCount = users.filter(u => u.status === 'archived').length;

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-primary-700 text-white p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide uppercase">
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>{isId ? 'Panel Kontrol Super Admin' : 'Super Admin Master Control'}</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              {isId ? 'Manajemen Pengguna' : 'User Management'}
            </h2>
            <p className="text-purple-100 max-w-2xl text-sm leading-relaxed">
              {isId 
                ? 'Kelola akun pengguna, pantau paket langganan (Free, Pro, Enterprise), serta kendalikan status akun.' 
                : 'Manage user accounts, monitor subscription tiers (Free, Pro, Enterprise), and control account status.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadUsers}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md font-semibold text-sm transition-all shadow-sm"
            >
              <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isId ? 'Segarkan' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              {isId ? 'Total Akun Klien' : 'Total Client Accounts'}
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalUsers}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
            <UsersIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              {isId ? 'Akun Aktif' : 'Active Accounts'}
            </p>
            <h3 className="text-3xl font-extrabold text-emerald-600">{activeCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              {isId ? 'Diarsipkan (Soft Delete)' : 'Archived (Soft Delete)'}
            </p>
            <h3 className="text-3xl font-extrabold text-amber-600">{archivedCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
            <Archive className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isId ? 'Cari nama, email, atau no. telepon...' : 'Search by name, email, or phone...'}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white placeholder-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">{isId ? 'Semua Status' : 'All Statuses'}</option>
            <option value="active">{isId ? 'Hanya Aktif' : 'Active Only'}</option>
            <option value="archived">{isId ? 'Hanya Diarsipkan' : 'Archived Only'}</option>
          </select>

          {/* Role Filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">{isId ? 'Semua Role' : 'All Roles'}</option>
            <option value="admin">Client Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>

          {/* Plan Filter */}
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value as any)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">{isId ? 'Semua Paket' : 'All Plans'}</option>
            <option value="free">Free Plan</option>
            <option value="pro">Pro Plan</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">{isId ? 'Klien Admin' : 'Client Admin'}</th>
                <th className="py-4 px-6">{isId ? 'Telepon / WA' : 'Phone'}</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">{isId ? 'Paket' : 'Subscription'}</th>
                <th className="py-4 px-6 text-right">{isId ? 'Aksi Otoritas' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    {isLoading ? (isId ? 'Memuat data pengguna...' : 'Loading users...') : (isId ? 'Tidak ada pengguna ditemukan.' : 'No users found.')}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrent = u.id === currentUser.id;
                  const isSuper = u.role === 'super_admin';
                  const isArchived = u.status === 'archived';
                  const userAvatar = u.avatarUrl || u.avatar_url || `https://picsum.photos/seed/${encodeURIComponent(u.name)}/100`;

                  return (
                    <tr key={u.id} className={`transition-colors ${isArchived ? 'bg-slate-50/60 dark:bg-slate-950/40 opacity-75' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/40'}`}>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={userAvatar}
                            alt={u.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 shadow-sm"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-slate-900 dark:text-white leading-snug">{u.name}</p>
                              {isCurrent && (
                                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                                  {isId ? 'Anda' : 'You'}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-medium text-slate-700 dark:text-slate-300 text-sm">
                          {u.phone || '-'}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        {isArchived ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            <Archive className="w-3 h-3" />
                            <span>{isId ? 'Diarsipkan' : 'Archived'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle className="w-3 h-3" />
                            <span>{isId ? 'Aktif' : 'Active'}</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold uppercase ${
                          u.subscription?.type === 'enterprise'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                            : u.subscription?.type === 'pro'
                            ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {u.subscription?.type || 'Free'}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          {/* Role Switcher */}
                          {!isCurrent && (
                            <select
                              disabled={processingId === u.id || isArchived}
                              value={u.role === 'super_admin' ? 'super_admin' : 'admin'}
                              onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                              className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none disabled:opacity-50"
                            >
                              <option value="admin">Client Admin</option>
                              <option value="super_admin">Super Admin</option>
                            </select>
                          )}

                          {/* Plan Switcher */}
                          <select
                            disabled={processingId === u.id || isArchived}
                            value={u.subscription?.type || 'free'}
                            onChange={(e) => handlePlanChange(u.id, e.target.value as any)}
                            className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none disabled:opacity-50"
                          >
                            <option value="free">Free</option>
                            <option value="pro">Pro</option>
                            <option value="enterprise">Enterprise</option>
                          </select>

                          {/* Soft Delete (Archive) or Restore Action */}
                          {!isCurrent && (
                            isArchived ? (
                              <button
                                disabled={processingId === u.id}
                                onClick={() => handleRestore(u.id, u.name)}
                                title={isId ? 'Pulihkan Akun Klien' : 'Restore Client Account'}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                disabled={processingId === u.id}
                                onClick={() => handleArchive(u.id, u.name)}
                                title={isId ? 'Arsipkan Akun (Soft Delete)' : 'Archive Account (Soft Delete)'}
                                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors"
                              >
                                <Archive className="w-4 h-4" />
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminUserManagement;

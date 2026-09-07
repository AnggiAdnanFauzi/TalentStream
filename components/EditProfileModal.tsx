import React, { useState, useRef } from 'react';
import { User } from '../types';
import { apiUploadFile, apiUpdateProfile } from '../services/api';
import { XMarkIcon, ArrowPathIcon } from './icons/Icons';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  language?: 'en' | 'id';
  addToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  language = 'id',
  addToast
}) => {
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || user.avatar_url || '');
  const [password, setPassword] = useState('');
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const isId = language === 'id';

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      if (addToast) addToast(isId ? 'Harap pilih file gambar (JPG, PNG, WebP)' : 'Please select an image file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      if (addToast) addToast(isId ? 'Ukuran file maksimal 5MB' : 'File size must be under 5MB', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const res = await apiUploadFile(file);
      if (res.success && res.url) {
        setAvatarUrl(res.url);
        if (addToast) addToast(isId ? 'Foto profil berhasil diunggah ke Cloudinary!' : 'Avatar uploaded to Cloudinary!', 'success');
      } else {
        // Fallback to local object URL if backend upload fails
        const localPreview = URL.createObjectURL(file);
        setAvatarUrl(localPreview);
        if (addToast) addToast(isId ? 'Foto profil lokal terpilih.' : 'Local avatar preview selected.', 'info');
      }
    } catch (err) {
      const localPreview = URL.createObjectURL(file);
      setAvatarUrl(localPreview);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      if (addToast) addToast(isId ? 'Nama tidak boleh kosong' : 'Name cannot be empty', 'error');
      return;
    }
    if (!email.trim()) {
      if (addToast) addToast(isId ? 'Email tidak boleh kosong' : 'Email cannot be empty', 'error');
      return;
    }
    if (password && password.length < 6) {
      if (addToast) addToast(isId ? 'Password minimal 6 karakter' : 'Password must be at least 6 characters', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const res = await apiUpdateProfile({
        id: user.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        avatar_url: avatarUrl,
        password: password ? password : undefined,
      });

      const updatedUser: User = {
        ...user,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        avatarUrl: avatarUrl,
        avatar_url: avatarUrl,
        ...(res?.user ? res.user : {})
      };

      onUpdateUser(updatedUser);
      localStorage.setItem('ts_session', JSON.stringify(updatedUser));

      if (addToast) {
        addToast(isId ? 'Profil berhasil diperbarui!' : 'Profile updated successfully!', 'success');
      }
      onClose();
    } catch (err: any) {
      if (addToast) {
        addToast(isId ? 'Gagal memperbarui profil: ' + err.message : 'Failed to update profile: ' + err.message, 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const currentDisplayAvatar = avatarUrl || `https://picsum.photos/seed/${encodeURIComponent(user.name)}/120`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {isId ? 'Edit Profil Pengguna' : 'Edit User Profile'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isId ? 'Perbarui informasi profil dan foto akun Anda' : 'Update your account profile and photo'}
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <div className="relative group">
              <img 
                src={currentDisplayAvatar} 
                alt="Profile Avatar"
                className="w-20 h-20 rounded-full object-cover ring-4 ring-white dark:ring-slate-800 shadow-md"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center">
                  <ArrowPathIcon className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                {isId ? 'Foto Profil' : 'Profile Picture'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                {isId ? 'PNG, JPG atau WebP hingga 5MB. Tersimpan di Cloudinary.' : 'PNG, JPG or WebP up to 5MB. Hosted on Cloudinary.'}
              </p>
              
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleAvatarChange} 
                className="hidden" 
              />

              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                    <span>{isId ? 'Mengunggah...' : 'Uploading...'}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{isId ? 'Ganti Foto' : 'Change Photo'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Nama */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                {isId ? 'Nama Lengkap' : 'Full Name'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all shadow-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                {isId ? 'Alamat Email' : 'Email Address'} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all shadow-sm"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                {isId ? 'Nomor HP / WhatsApp' : 'Phone / WhatsApp'}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+62 812-3456-7890"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all shadow-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                {isId ? 'Password Baru' : 'New Password'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isId ? 'Biarkan kosong jika tidak diubah' : 'Leave blank to keep current password'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all shadow-sm"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {isId ? 'Minimal 6 karakter jika ingin mengganti kata sandi.' : 'Min. 6 characters if you wish to change your password.'}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm transition-colors"
            >
              {isId ? 'Batal' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-all shadow-lg shadow-primary-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
              <span>{isSaving ? (isId ? 'Menyimpan...' : 'Saving...') : (isId ? 'Simpan Perubahan' : 'Save Changes')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;

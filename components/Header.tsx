import React, { useState } from 'react';
import { SunIcon, MoonIcon, BellIcon } from './icons/Icons';
import { User } from '../types';
import EditProfileModal from './EditProfileModal';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: 'en' | 'id';
  onLanguageChange: (lang: 'en' | 'id') => void;
  user: User;
  onLogout: () => void;
  onMenuToggle?: () => void;
  onUpdateUser?: (updatedUser: User) => void;
  addToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

const Header: React.FC<HeaderProps> = ({
  theme,
  toggleTheme,
  language,
  onLanguageChange,
  user,
  onLogout,
  onMenuToggle,
  onUpdateUser,
  addToast
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const displayAvatar = user.avatarUrl || user.avatar_url || `https://picsum.photos/seed/${encodeURIComponent(user.name)}/100`;
  
  return (
    <>
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex-shrink-0 sticky top-0 z-40">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between lg:justify-end h-16 pointer-events-auto">
            <div className="flex items-center lg:hidden">
              <button onClick={onMenuToggle} className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mr-2">
                  <button
                      onClick={() => onLanguageChange('en')}
                      className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${language === 'en' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                      EN
                  </button>
                  <button
                      onClick={() => onLanguageChange('id')}
                      className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${language === 'id' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                      ID
                  </button>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-900"
              >
                {theme === 'light' ? (
                  <MoonIcon className="h-6 w-6" />
                ) : (
                  <SunIcon className="h-6 w-6" />
                )}
              </button>
              <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-900">
                <BellIcon className="h-6 w-6" />
              </button>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
              
              {/* User Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <img
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                    src={displayAvatar}
                    alt="User avatar"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{user.name}</p>
                    <p className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">{language === 'id' ? `PAKET ${user.subscription.type.toUpperCase()}` : `${user.subscription.type.toUpperCase()} PLAN`}</p>
                  </div>
                </button>
                
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-0" 
                      onClick={() => setIsDropdownOpen(false)}
                    ></div>
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-10 transition-all transform animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">{user.name}</p>
                        
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      </div>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsEditProfileOpen(true);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-medium transition-colors flex items-center gap-2.5"
                      >
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{language === 'id' ? 'Edit Profil' : 'Edit Profile'}</span>
                      </button>

                      <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                      <button 
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onLogout();
                        }} 
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold transition-colors flex items-center gap-2.5"
                      >
                        <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>{language === 'id' ? 'Keluar' : 'Logout'}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {isEditProfileOpen && (
        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          user={user}
          onUpdateUser={onUpdateUser || (() => {})}
          language={language}
          addToast={addToast}
        />
      )}
    </>
  );
};

export default Header;

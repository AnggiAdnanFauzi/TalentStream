import React from 'react';
import { ActiveTab, User } from '../types';
import { 
  DocumentPlusIcon, 
  UserSearchIcon, 
  ClipboardDocumentListIcon, 
  UserPlusIcon, 
  CheckBadgeIcon, 
  ChartPieIcon, 
  Cog6ToothIcon, 
  LightBulbIcon, 
  CreditCardIcon, 
  ShareIcon, 
  QuestionMarkCircleIcon,
  UsersIcon
} from './icons/Icons';
import { ShieldCheck, Activity } from 'lucide-react';
import { translations } from '../utils/translations';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isOpen?: boolean;
  onClose?: () => void;
  language: 'en' | 'id';
  user?: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isOpen, onClose, language, user }) => {
  const t = translations[language].dashboard;
  const isSuperAdmin = user?.role === 'super_admin';
  const isId = language === 'id';

  // Super Admin Tabs
  const superAdminTabs: { id: ActiveTab; label: string; description: string; icon: React.ReactElement }[] = [
    { 
      id: 'admin_users', 
      label: isId ? 'Manajemen Pengguna' : 'User Management', 
      description: isId ? 'Otoritas & Langganan' : 'Roles & Subscriptions', 
      icon: <UsersIcon className="h-6 w-6 text-purple-500" /> 
    },
    { 
      id: 'admin_analytics', 
      label: isId ? 'Metrik Sistem' : 'System Metrics', 
      description: isId ? 'Infrastruktur Cloud' : 'Cloud Infrastructure', 
      icon: <Activity className="h-6 w-6 text-purple-500" /> 
    },
  ];

  // Recruiter Lifecycle Tabs
  const recruitmentCycleTabs: { id: ActiveTab; label: string; description: string; icon: React.ReactElement }[] = [
      { id: 'requisition', label: t.requisition, description: t.reqDesc, icon: <DocumentPlusIcon className="h-6 w-6" /> },
      { id: 'sourcing', label: t.sourcing, description: t.srcDesc, icon: <UserSearchIcon className="h-6 w-6" /> },
      { id: 'screening', label: t.screening, description: t.scrDesc, icon: <ClipboardDocumentListIcon className="h-6 w-6" /> },
      { id: 'selection', label: t.selection, description: t.selDesc, icon: <UserPlusIcon className="h-6 w-6" /> },
      { id: 'hire', label: t.hire, description: t.hireDesc, icon: <CheckBadgeIcon className="h-6 w-6" /> },
  ];

  const guidesTab: { id: ActiveTab; label: string; description: string; icon: React.ReactElement } = {
      id: 'guides', label: t.guides, description: t.guidesDesc, icon: <LightBulbIcon className="h-6 w-6" />
  };

  const otherTabs: { id: ActiveTab; label: string; description: string; icon: React.ReactElement }[] = [
      { id: 'analytics', label: t.analytics, description: t.analyticsDesc, icon: <ChartPieIcon className="h-6 w-6" /> },
      { id: 'billing', label: t.billing, description: t.billingDesc, icon: <CreditCardIcon className="h-6 w-6" /> },
      { id: 'affiliate', label: t.affiliate, description: t.affiliateDesc, icon: <ShareIcon className="h-6 w-6" /> },
      { id: 'support', label: t.support, description: t.supportDesc, icon: <QuestionMarkCircleIcon className="h-6 w-6" /> },
      { id: 'settings', label: t.settings, description: t.settingsDesc, icon: <Cog6ToothIcon className="h-6 w-6" /> },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="TalentStream Logo" className="h-8 w-8 object-contain" />
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-none">TalentStream</h1>
              {isSuperAdmin && (
                <span className="inline-block mt-0.5 px-1.5 py-0.2 text-[9px] font-extrabold uppercase rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                  Super Admin
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 -mr-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
          {/* Super Admin Control Section (Visible ONLY to Super Admin) */}
          {isSuperAdmin && (
            <div className="p-3 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 rounded-2xl mb-4">
              <div className="flex items-center gap-1.5 px-2 text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>{isId ? 'Menu Super Admin' : 'Super Admin Control'}</span>
              </div>
              <div className="space-y-1">
                {superAdminTabs.map(tab => (
                  <NavItem 
                    key={tab.id}
                    label={tab.label}
                    description={tab.description}
                    icon={tab.icon} 
                    isActive={activeTab === tab.id} 
                    onClick={() => onTabChange(tab.id)} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Standard Recruitment Section */}
          <div>
            <h2 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {isSuperAdmin 
                ? (isId ? 'Alur Rekrutmen (Recruiter)' : 'Recruiter Lifecycle') 
                : t.cycleTitle}
            </h2>
            <div className="space-y-1">
              {recruitmentCycleTabs.map(tab => (
                <NavItem 
                  key={tab.id}
                  label={tab.label}
                  description={tab.description}
                  icon={tab.icon} 
                  isActive={activeTab === tab.id} 
                  onClick={() => onTabChange(tab.id)} 
                />
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 !mt-6 pt-4">
            <NavItem 
              key={guidesTab.id}
              label={guidesTab.label}
              description={guidesTab.description}
              icon={guidesTab.icon} 
              isActive={activeTab === guidesTab.id} 
              onClick={() => onTabChange(guidesTab.id)} 
            />
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 !mt-6 pt-4">
            <div className="space-y-1">
              {otherTabs.map(tab => (
                <NavItem 
                  key={tab.id}
                  label={tab.label}
                  description={tab.description}
                  icon={tab.icon} 
                  isActive={activeTab === tab.id} 
                  onClick={() => onTabChange(tab.id)} 
                />
              ))}
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};

interface NavItemProps {
    label: string;
    description: string;
    icon: React.ReactElement;
    isActive: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, description, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-3 py-2.5 text-left rounded-xl transition-colors ${
            isActive
                ? 'bg-primary-100 dark:bg-primary-900/50'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
    >
        <div className={`flex-shrink-0 ${isActive ? 'text-primary-600 dark:text-primary-300' : 'text-slate-500 dark:text-slate-400'}`}>
             {icon}
        </div>
        <div>
            <p className={`font-semibold text-sm ${isActive ? 'text-primary-700 dark:text-primary-200' : 'text-slate-700 dark:text-slate-200'}`}>{label}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">{description}</p>
        </div>
    </button>
);

export default Sidebar;

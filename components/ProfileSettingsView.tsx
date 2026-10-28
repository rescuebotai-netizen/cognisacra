
import React, { useState } from 'react';
import { UserSettings } from '../types';
import AccountSettings from './settings/AccountSettings';
import LearningSettings from './settings/LearningSettings';
import NotificationSettings from './settings/NotificationSettings';
import PrivacySettings from './settings/PrivacySettings';
import PaymentSettings from './settings/PaymentSettings';
import AccessibilitySettings from './settings/AccessibilitySettings';
import SupportSettings from './settings/SupportSettings';

import UserCircleIcon from './icons/UserCircleIcon';
import AdjustmentsHorizontalIcon from './icons/AdjustmentsHorizontalIcon';
import BellIcon from './icons/BellIcon';
import ShieldCheckIcon from './icons/ShieldCheckIcon';
import CreditCardIcon from './icons/CreditCardIcon';
import SunIcon from './icons/SunIcon';
import QuestionMarkCircleIcon from './icons/QuestionMarkCircleIcon';

type SettingsTab = 'account' | 'learning' | 'notifications' | 'privacy' | 'payment' | 'accessibility' | 'support';
type Theme = 'light' | 'dark';
type TextSize = 'base' | 'lg' | 'xl';


interface ProfileSettingsViewProps {
    settings: UserSettings;
    onSaveSettings: (updatedSettings: UserSettings) => void;
    onUpdateTheme: (theme: Theme) => void;
    onUpdateTextSize: (size: TextSize) => void;
    currentTheme: Theme;
    currentTextSize: TextSize;
}

const TabButton: React.FC<{ isActive: boolean; onClick: () => void; children: React.ReactNode }> = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full text-left p-3 rounded-lg transition-colors whitespace-nowrap ${
            isActive
                ? 'bg-crimson/10 dark:bg-crimson/20 text-crimson dark:text-red-300 font-semibold'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
        }`}
        role="tab"
        aria-selected={isActive}
    >
        {children}
    </button>
);


const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({ settings, onSaveSettings, onUpdateTheme, onUpdateTextSize, currentTheme, currentTextSize }) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('account');
    const [localSettings, setLocalSettings] = useState(settings);

    const handleSave = () => {
        onSaveSettings(localSettings);
        alert('Settings saved successfully!');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'account':
                return <AccountSettings settings={localSettings.account} />;
            case 'learning':
                return <LearningSettings settings={localSettings.learning} />;
            case 'notifications':
                return <NotificationSettings settings={localSettings.notifications} />;
            case 'privacy':
                return <PrivacySettings settings={localSettings.privacy} />;
            case 'payment':
                return <PaymentSettings settings={localSettings.payment} />;
            case 'accessibility':
                return <AccessibilitySettings 
                    settings={localSettings.accessibility} 
                    onUpdateTheme={onUpdateTheme} 
                    onUpdateTextSize={onUpdateTextSize} 
                    currentTheme={currentTheme}
                    currentTextSize={currentTextSize}
                />;
            case 'support':
                return <SupportSettings settings={localSettings.support} />;
            default:
                return null;
        }
    }

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-serif">Settings</h1>
                <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">Manage your account and preferences.</p>
            </div>
             <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/4">
                    <nav className="flex flex-row overflow-x-auto md:flex-col md:overflow-x-visible space-x-2 md:space-x-0 md:space-y-1 -mx-4 px-4 md:mx-0 md:px-0" role="tablist" aria-orientation="vertical">
                         <TabButton isActive={activeTab === 'account'} onClick={() => setActiveTab('account')}>
                            <UserCircleIcon className="w-5 h-5 mr-3" /> Account & Security
                        </TabButton>
                        <TabButton isActive={activeTab === 'learning'} onClick={() => setActiveTab('learning')}>
                            <AdjustmentsHorizontalIcon className="w-5 h-5 mr-3" /> Learning
                        </TabButton>
                        <TabButton isActive={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')}>
                            <BellIcon className="w-5 h-5 mr-3" /> Notifications
                        </TabButton>
                         <TabButton isActive={activeTab === 'privacy'} onClick={() => setActiveTab('privacy')}>
                            <ShieldCheckIcon className="w-5 h-5 mr-3" /> Privacy
                        </TabButton>
                        <TabButton isActive={activeTab === 'payment'} onClick={() => setActiveTab('payment')}>
                            <CreditCardIcon className="w-5 h-5 mr-3" /> Payments
                        </TabButton>
                         <TabButton isActive={activeTab === 'accessibility'} onClick={() => setActiveTab('accessibility')}>
                            <SunIcon className="w-5 h-5 mr-3" /> Accessibility
                        </TabButton>
                        <TabButton isActive={activeTab === 'support'} onClick={() => setActiveTab('support')}>
                            <QuestionMarkCircleIcon className="w-5 h-5 mr-3" /> Support & Help
                        </TabButton>
                    </nav>
                </div>
                 <div className="md:w-3/4">
                    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        {renderContent()}
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button 
                            onClick={handleSave}
                            className="px-6 py-2 font-semibold text-white bg-crimson rounded-lg hover:bg-red-800 shadow-md"
                        >
                            Save All Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettingsView;

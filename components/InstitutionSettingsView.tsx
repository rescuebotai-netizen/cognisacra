import React, { useState } from 'react';
import { FullInstitutionData } from '../types';
import BookOpenIcon from './icons/BookOpenIcon';
import CreditCardIcon from './icons/CreditCardIcon';
import CogIcon from './icons/CogIcon';

interface InstitutionSettingsViewProps {
    institutionData: FullInstitutionData;
    onSave: (updatedData: FullInstitutionData) => void;
}

type SettingsTab = 'branding' | 'monetization' | 'customization';

const TabButton: React.FC<{ isActive: boolean; onClick: () => void; children: React.ReactNode }> = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full md:w-auto justify-center md:justify-start px-4 py-2 font-semibold transition-colors text-sm rounded-md ${
            isActive
                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
        }`}
    >
        {children}
    </button>
);

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: () => void, label: string }> = ({ enabled, onChange, label }) => (
    <button
        onClick={onChange}
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
            enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
        }`}
    >
        <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
    </button>
);

const InstitutionSettingsView: React.FC<InstitutionSettingsViewProps> = ({ institutionData, onSave }) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('branding');
    const [settings, setSettings] = useState(institutionData);

    const handleBrandingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings(prev => ({ ...prev, branding: { ...prev.branding, [e.target.name]: e.target.value } }));
    };
    
    const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings(prev => ({ ...prev, settings: { ...prev.settings, [e.target.name]: e.target.value } }));
    };

    const handleToggle = (key: 'whiteLabel' | 'multiLanguage' | 'scholarshipsEnabled') => {
        if (key === 'scholarshipsEnabled') {
            setSettings(prev => ({...prev, monetization: {...prev.monetization, [key]: !prev.monetization[key]} }));
        } else {
            setSettings(prev => ({ ...prev, settings: { ...prev.settings, [key]: !prev.settings[key] } }));
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'branding': return (
                <div className="space-y-6">
                    <h3 className="text-xl font-bold">Public Profile Branding</h3>
                    <div className="flex items-center">
                        <img src={settings.branding.logoUrl} alt="Logo" className="h-12 mr-4 bg-gray-200 p-1 rounded" />
                        <button className="text-sm font-medium text-blue-600 hover:underline">Upload New Logo</button>
                    </div>
                     <div>
                        <label className="text-sm font-medium">Primary Color</label>
                         <div className="flex items-center mt-1">
                             <input type="color" name="primaryColor" value={settings.branding.primaryColor} onChange={handleBrandingChange} className="w-10 h-10 p-1 border rounded-md cursor-pointer"/>
                              <span className="ml-3 px-2 py-1 text-sm rounded" style={{ backgroundColor: settings.branding.primaryColor, color: '#fff', textShadow: '0 0 2px #000' }}>{settings.branding.primaryColor}</span>
                         </div>
                    </div>
                </div>
            );
            case 'monetization': return (
                <div className="space-y-6">
                    <h3 className="text-xl font-bold">Monetization & Partnerships</h3>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <label className="font-medium">Enable Scholarships / Financial Aid</label>
                        <ToggleSwitch enabled={settings.monetization.scholarshipsEnabled} onChange={() => handleToggle('scholarshipsEnabled')} label="Enable Scholarships" />
                    </div>
                     <div>
                        <h4 className="font-semibold">Corporate Training Packages</h4>
                        {settings.monetization.pricingTiers.map(tier => (
                            <div key={tier.id} className="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <p className="font-medium">{tier.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">${tier.price} - {tier.description}</p>
                            </div>
                        ))}
                        <button className="w-full mt-2 py-2 text-sm font-semibold text-blue-600 border-2 border-dashed border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50">
                            + Add Pricing Tier
                        </button>
                    </div>
                </div>
            );
            case 'customization': return (
                 <div className="space-y-6">
                    <h3 className="text-xl font-bold">Platform Customization</h3>
                    <div>
                        <label htmlFor="customDomain" className="text-sm font-medium">Custom Subdomain</label>
                        <input type="text" id="customDomain" name="customDomain" value={settings.settings.customDomain} onChange={handleSettingsChange} className="mt-1 block w-full md:w-1/2 rounded-md border-gray-300 shadow-sm sm:text-sm dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                     <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <label className="font-medium">Enable White-Label Experience</label>
                        <ToggleSwitch enabled={settings.settings.whiteLabel} onChange={() => handleToggle('whiteLabel')} label="Enable White-Label" />
                    </div>
                     <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <label className="font-medium">Enable Multi-Language Support</label>
                        <ToggleSwitch enabled={settings.settings.multiLanguage} onChange={() => handleToggle('multiLanguage')} label="Enable Multi-Language" />
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Institution Settings</h1>
                <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">Manage your portal's configuration.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/4">
                    <nav className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                        <TabButton isActive={activeTab === 'branding'} onClick={() => setActiveTab('branding')}>
                            <BookOpenIcon className="w-5 h-5 mr-2" /> Branding
                        </TabButton>
                        <TabButton isActive={activeTab === 'monetization'} onClick={() => setActiveTab('monetization')}>
                            <CreditCardIcon className="w-5 h-5 mr-2" /> Monetization
                        </TabButton>
                        <TabButton isActive={activeTab === 'customization'} onClick={() => setActiveTab('customization')}>
                            <CogIcon className="w-5 h-5 mr-2" /> Customization
                        </TabButton>
                    </nav>
                </div>
                <div className="md:w-3/4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                    {renderContent()}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                        <button onClick={() => onSave(settings)} className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstitutionSettingsView;
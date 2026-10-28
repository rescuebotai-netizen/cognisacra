import React from 'react';
import { UserSettings } from '../../types';

interface NotificationSettingsProps {
    settings: UserSettings['notifications'];
}

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; onChange: () => void }> = ({ label, enabled, onChange }) => (
     <div className="flex justify-between items-center py-2">
        <label htmlFor={label} className="font-medium">{label}</label>
        <button
            id={label}
            onClick={onChange}
            role="switch"
            aria-checked={enabled}
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
    </div>
);

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ settings }) => {
    // Dummy onChange handlers for demonstration
    const handleChange = () => {};

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications & Communication</h2>
            
            <div className="space-y-2 divide-y dark:divide-gray-700">
                <ToggleSwitch label="Lesson Reminders" enabled={settings.reminders} onChange={handleChange} />
                <ToggleSwitch label="Certificate Completions" enabled={settings.certificates} onChange={handleChange} />
                <ToggleSwitch label="Promotional Offers" enabled={settings.offers} onChange={handleChange} />
            </div>

             <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Forum/Peer Interactions</h3>
                 <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                        <input id="forum-all" name="forum" type="radio" defaultChecked={settings.forum === 'all'} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                        <label htmlFor="forum-all" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">All Interactions</label>
                    </div>
                     <div className="flex items-center">
                        <input id="forum-highlights" name="forum" type="radio" defaultChecked={settings.forum === 'highlights'} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                        <label htmlFor="forum-highlights" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">Highlights Only</label>
                    </div>
                    <div className="flex items-center">
                        <input id="forum-none" name="forum" type="radio" defaultChecked={settings.forum === 'none'} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                        <label htmlFor="forum-none" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">Mute All</label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationSettings;

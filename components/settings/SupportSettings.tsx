import React from 'react';
import { UserSettings } from '../../types';

interface SupportSettingsProps {
    settings: UserSettings['support'];
}

const SupportSettings: React.FC<SupportSettingsProps> = ({ settings }) => {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Support & Help</h2>
            
            <div className="space-y-2">
                <a href="#" className="block font-medium text-blue-600 hover:underline">Help Center & FAQs</a>
                <a href="#" className="block font-medium text-blue-600 hover:underline">Contact Support</a>
                <a href="#" className="block font-medium text-blue-600 hover:underline">Report an Issue</a>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Manage Your Data</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">You have the right to manage your personal data.</p>
                <div className="space-y-2">
                    <button className="text-sm font-semibold text-blue-600 hover:underline">Export My Data</button>
                </div>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Delete Account</h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                    Permanently delete your account and all associated data. This action is irreversible.
                </p>
                <button className="mt-3 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700">
                    Request Account Deletion
                </button>
            </div>
        </div>
    );
};

export default SupportSettings;

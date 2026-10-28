import React from 'react';
import { UserSettings } from '../../types';
import GoogleIcon from '../icons/GoogleIcon';
import AppleIcon from '../icons/AppleIcon';
import LinkedInIcon from '../icons/LinkedInIcon';

interface AccountSettingsProps {
    settings: UserSettings['account'];
}

const ConnectedAccount: React.FC<{ name: string, icon: React.ReactNode }> = ({ name, icon }) => (
    <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center">
            {icon}
            <span className="ml-3 font-medium text-gray-800 dark:text-gray-200">Connected to {name}</span>
        </div>
        <button className="text-sm font-semibold text-red-600 dark:text-red-400 hover:underline">Disconnect</button>
    </div>
);


const AccountSettings: React.FC<AccountSettingsProps> = ({ settings }) => {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Account & Security</h2>
            
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Login Information</h3>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{settings.email}</p>
                    </div>
                    <button className="text-sm font-semibold text-blue-600 hover:underline">Change</button>
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-medium">Password</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">********</p>
                    </div>
                    <button className="text-sm font-semibold text-blue-600 hover:underline">Change</button>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Two-Factor Authentication (2FA)</h3>
                 <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-700 rounded-lg">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">2FA is currently enabled on your account.</p>
                    <button className="text-sm font-semibold text-red-600 hover:underline">Disable</button>
                </div>
            </div>

            <div className="space-y-4">
                 <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Connected Accounts</h3>
                 <div className="space-y-2">
                     {settings.connectedAccounts.includes('google') && <ConnectedAccount name="Google" icon={<GoogleIcon />} />}
                     {settings.connectedAccounts.includes('linkedin') && <ConnectedAccount name="LinkedIn" icon={<LinkedInIcon />} />}
                     {settings.connectedAccounts.includes('apple') && <ConnectedAccount name="Apple" icon={<AppleIcon />} />}
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;

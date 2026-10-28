import React from 'react';
import { UserSettings } from '../../types';

interface PrivacySettingsProps {
    settings: UserSettings['privacy'];
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({ settings }) => {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy & Visibility</h2>

            <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Profile Visibility</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Control who can see your full profile page.</p>
                 <div className="mt-3 space-y-2">
                    <div className="flex items-center">
                        <input id="vis-public" name="visibility" type="radio" defaultChecked={settings.profileVisibility === 'public'} className="h-4 w-4 text-blue-600 border-gray-300" />
                        <label htmlFor="vis-public" className="ml-3 block text-sm font-medium">Public (Visible to everyone)</label>
                    </div>
                     <div className="flex items-center">
                        <input id="vis-students" name="visibility" type="radio" defaultChecked={settings.profileVisibility === 'students'} className="h-4 w-4 text-blue-600 border-gray-300" />
                        <label htmlFor="vis-students" className="ml-3 block text-sm font-medium">Students Only (Visible to logged-in users)</label>
                    </div>
                    <div className="flex items-center">
                        <input id="vis-private" name="visibility" type="radio" defaultChecked={settings.profileVisibility === 'private'} className="h-4 w-4 text-blue-600 border-gray-300" />
                        <label htmlFor="vis-private" className="ml-3 block text-sm font-medium">Private (Only you can see it)</label>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Activity Visibility</h3>
                 <div className="mt-3 space-y-2">
                     <div className="flex items-center">
                        <input id="show-courses" type="checkbox" defaultChecked={settings.showCompletedCourses} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                        <label htmlFor="show-courses" className="ml-3 block text-sm font-medium">Show completed courses on my profile</label>
                    </div>
                    <div className="flex items-center">
                        <input id="show-achievements" type="checkbox" defaultChecked={settings.showAchievements} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                        <label htmlFor="show-achievements" className="ml-3 block text-sm font-medium">Show achievements on my profile</label>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PrivacySettings;

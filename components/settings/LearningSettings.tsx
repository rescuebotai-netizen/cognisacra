import React from 'react';
import { UserSettings } from '../../types';

interface LearningSettingsProps {
    settings: UserSettings['learning'];
}

const LearningSettings: React.FC<LearningSettingsProps> = ({ settings }) => {
    return (
         <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Learning Preferences</h2>
            
            <div className="space-y-4">
                 <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Default Language</label>
                    <select id="language" defaultValue={settings.language} className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm">
                        <option value="en-US">English (US)</option>
                        <option value="es-ES">Spanish</option>
                        <option value="fr-FR">French</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="videoQuality" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Video Playback Quality</label>
                    <select id="videoQuality" defaultValue={settings.videoQuality} className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm">
                        <option value="auto">Auto</option>
                        <option value="1080p">1080p</option>
                        <option value="720p">720p</option>
                        <option value="480p">480p</option>
                    </select>
                </div>
                <div className="flex justify-between items-center">
                    <label htmlFor="autoplay" className="font-medium">Autoplay Videos</label>
                    {/* Add toggle switch component here */}
                </div>
                <div className="flex justify-between items-center">
                    <label htmlFor="subtitles" className="font-medium">Subtitles & Transcripts</label>
                    {/* Add toggle switch component here */}
                </div>
            </div>
        </div>
    );
};

export default LearningSettings;

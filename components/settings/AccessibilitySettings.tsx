import React from 'react';
import { UserSettings } from '../../types';
import SunIcon from '../icons/SunIcon';
import MoonIcon from '../icons/MoonIcon';

type Theme = 'light' | 'dark';
type TextSize = 'base' | 'lg' | 'xl';

interface AccessibilitySettingsProps {
    settings: UserSettings['accessibility'];
    onUpdateTheme: (theme: Theme) => void;
    onUpdateTextSize: (size: TextSize) => void;
    currentTheme: Theme;
    currentTextSize: TextSize;
}

const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({ onUpdateTheme, onUpdateTextSize, currentTheme, currentTextSize }) => {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Accessibility</h2>
            
            <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Color Scheme</h3>
                <div className="flex space-x-2 rounded-lg bg-gray-200 dark:bg-gray-700 p-1">
                    <button
                        onClick={() => onUpdateTheme('light')}
                        className={`w-full flex justify-center items-center rounded-md py-2 px-3 text-sm font-medium ${currentTheme === 'light' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}
                        aria-pressed={currentTheme === 'light'}
                    >
                        <SunIcon className="w-5 h-5 mr-2" /> Light
                    </button>
                    <button
                        onClick={() => onUpdateTheme('dark')}
                        className={`w-full flex justify-center items-center rounded-md py-2 px-3 text-sm font-medium ${currentTheme === 'dark' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}
                        aria-pressed={currentTheme === 'dark'}
                    >
                         <MoonIcon className="w-5 h-5 mr-2" /> Dark
                    </button>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Text Size</h3>
                <div className="flex space-x-2 rounded-lg bg-gray-200 dark:bg-gray-700 p-1">
                    <button
                        onClick={() => onUpdateTextSize('base')}
                        className={`w-full rounded-md py-2 px-3 text-sm font-medium ${currentTextSize === 'base' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}
                        aria-pressed={currentTextSize === 'base'}
                    >
                        Default
                    </button>
                     <button
                        onClick={() => onUpdateTextSize('lg')}
                        className={`w-full rounded-md py-2 px-3 font-medium text-lg ${currentTextSize === 'lg' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}
                        aria-pressed={currentTextSize === 'lg'}
                    >
                        Medium
                    </button>
                     <button
                        onClick={() => onUpdateTextSize('xl')}
                        className={`w-full rounded-md py-2 px-3 font-medium text-xl ${currentTextSize === 'xl' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}
                        aria-pressed={currentTextSize === 'xl'}
                    >
                        Large
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccessibilitySettings;

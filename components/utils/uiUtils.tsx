
import React from 'react';
import { Lesson, Resource } from '../../types';
import VideoCameraIcon from '../icons/VideoCameraIcon';
import DocumentTextIcon from '../icons/DocumentTextIcon';
import ClipboardCheckIcon from '../icons/ClipboardCheckIcon';
import CubeTransparentIcon from '../icons/CubeTransparentIcon';
import ListBulletIcon from '../icons/ListBulletIcon';
import FolderOpenIcon from '../icons/FolderOpenIcon';
import SignalIcon from '../icons/SignalIcon';
import LinkIcon from '../icons/LinkIcon';
import DocumentArrowDownIcon from '../icons/DocumentArrowDownIcon';
import ArchiveBoxIcon from '../icons/ArchiveBoxIcon';

export const getLessonIcon = (format: Lesson['format'], className: string = "w-6 h-6") => {
    switch (format) {
        case 'video':
            return <VideoCameraIcon className={`${className} text-blue-500`} />;
        case 'reading':
            return <DocumentTextIcon className={`${className} text-indigo-500`} />;
        case 'quiz':
            return <ClipboardCheckIcon className={`${className} text-amber-500`} />;
        case 'adaptive-quiz':
            return <ClipboardCheckIcon className={`${className} text-rose-500`} />;
        case 'project':
            return <FolderOpenIcon className={`${className} text-purple-500`} />;
        case 'live-session':
            return <SignalIcon className={`${className} text-red-500`} />;
        case 'metaverse':
            return <CubeTransparentIcon className={`${className} text-indigo-500`} />;
        default:
            return <ListBulletIcon className={`${className} text-gray-500`} />;
    }
};

export const getResourceIcon = (format: Resource['format'], className: string = "w-6 h-6") => {
     switch (format) {
        case 'pdf':
            return <DocumentArrowDownIcon className={`${className} text-red-500`} />;
        case 'zip':
            return <ArchiveBoxIcon className={`${className} text-yellow-600`} />;
        case 'link':
            return <LinkIcon className={`${className} text-blue-500`} />;
        case 'video':
            return <VideoCameraIcon className={`${className} text-indigo-500`} />;
        default:
            return <DocumentTextIcon className={`${className} text-gray-500`} />;
    }
}

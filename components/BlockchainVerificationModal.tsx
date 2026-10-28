import React, { useEffect, useRef } from 'react';
import { Certificate } from '../types';
import CertificateIcon from './icons/CertificateIcon';

interface BlockchainVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    certificate: Certificate;
}

const BlockchainVerificationModal: React.FC<BlockchainVerificationModalProps> = ({ isOpen, onClose, certificate }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const titleId = "verification-modal-title";

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        setTimeout(() => modalRef.current?.focus(), 100);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
            onClick={onClose}
            role="presentation"
        >
            <div 
                ref={modalRef}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md m-4 p-6 relative transform transition-all"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
            >
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900">
                        <CertificateIcon className="h-8 w-8 text-green-600 dark:text-green-300" />
                    </div>
                    <h3 id={titleId} className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Certificate Verified</h3>
                    <p className="mt-2 text-md text-gray-600 dark:text-gray-400">This credential is secured on the blockchain.</p>
                </div>

                <div className="mt-6 text-left bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Course</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{certificate.courseTitle}</p>
                    </div>
                     <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Issued On</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{certificate.issuedDate}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction Hash</p>
                        <p className="font-mono text-xs text-gray-700 dark:text-gray-300 break-all">{certificate.transactionHash}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlockchainVerificationModal;
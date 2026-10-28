import React, { useState, useEffect, useRef } from 'react';

interface InviteAdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInvite: (newAdmin: { name: string; email: string; role: 'Admin' | 'Billing Manager' }) => void;
}

const InviteAdminModal: React.FC<InviteAdminModalProps> = ({ isOpen, onClose, onInvite }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'Admin' | 'Billing Manager'>('Admin');
    const modalRef = useRef<HTMLDivElement>(null);
    const titleId = "invite-admin-modal-title";

    useEffect(() => {
        if (isOpen) {
            // Reset form on open
            setName('');
            setEmail('');
            setRole('Admin');
        }
    }, [isOpen]);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onInvite({ name, email, role });
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
            onClick={onClose}
            role="presentation"
        >
            <div 
                ref={modalRef}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md m-4 p-6 relative transform transition-all animate-fade-in"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
            >
                <h2 id={titleId} className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Invite New Administrator</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value as 'Admin' | 'Billing Manager')}
                            className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm"
                        >
                            <option>Admin</option>
                            <option>Billing Manager</option>
                        </select>
                    </div>
                    <div className="pt-4 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-semibold bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                            disabled={!name || !email}
                        >
                            Send Invitation
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InviteAdminModal;
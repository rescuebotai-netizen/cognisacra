
import React from 'react';
import { UserSettings } from '../../types';
import CreditCardIcon from '../icons/CreditCardIcon';
import ArrowDownTrayIcon from '../icons/ArrowDownTrayIcon';


interface PaymentSettingsProps {
    settings: UserSettings['payment'];
}

const PaymentSettings: React.FC<PaymentSettingsProps> = ({ settings }) => {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payments & Subscriptions</h2>
            
            <div className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="font-semibold text-blue-800 dark:text-blue-200">Current Plan: {settings.plan}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">Next renewal: 01 Jan 2025.</p>
                <button className="mt-2 text-sm font-semibold text-blue-600 hover:underline">Manage Subscription</button>
            </div>
            
            <div>
                 <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Payment Methods</h3>
                 <div className="mt-2 space-y-2">
                    {settings.paymentMethods.map(method => (
                        <div key={method.last4} className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                             <div className="flex items-center">
                                <CreditCardIcon className="w-6 h-6 mr-3 text-gray-500 dark:text-gray-400"/>
                                <span className="font-medium">Ending in {method.last4}</span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Expires {method.expiry}</span>
                        </div>
                    ))}
                     <button className="w-full mt-1 py-2 text-sm font-semibold text-blue-600 border-2 border-dashed border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50">
                        + Add Payment Method
                    </button>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Billing History</h3>
                <div className="mt-2 overflow-x-auto">
                     <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase">Date</th>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase">Amount</th>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {settings.billingHistory.map(item => (
                                <tr key={item.id}>
                                    <td className="px-4 py-3 text-sm">{item.date}</td>
                                    <td className="px-4 py-3 text-sm">${item.amount.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <a href={item.invoiceUrl} className="flex items-center text-blue-600 hover:underline">
                                            <ArrowDownTrayIcon className="w-4 h-4 mr-2" /> Download
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PaymentSettings;

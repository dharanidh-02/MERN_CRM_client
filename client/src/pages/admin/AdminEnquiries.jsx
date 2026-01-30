import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import * as API from '../../api';

const AdminEnquiries = ({ showToast, confirmAction }) => {
    const [enquiries, setEnquiries] = useState([]);

    // Load from API on mount
    useEffect(() => {
        loadEnquiries();
    }, []);

    const loadEnquiries = async () => {
        try {
            const res = await API.fetchEnquiries();
            setEnquiries(res.data);
        } catch (err) {
            console.error(err);
            if (showToast) showToast('Failed to load enquiries', 'error');
        }
    }

    const updateStatus = async (id, newStatus) => {
        try {
            await API.updateEnquiry(id, { status: newStatus });
            loadEnquiries();
            if (showToast) showToast('Status updated', 'success');
        } catch (err) {
            console.error(err);
            if (showToast) showToast('Failed to update status', 'error');
        }
    };

    const deleteEnquiry = async (id) => {
        if (confirmAction) {
            confirmAction({
                title: 'Delete Enquiry',
                message: 'Are you sure you want to delete this enquiry?',
                onConfirm: async () => {
                    try {
                        await API.deleteEnquiry(id);
                        loadEnquiries();
                        if (showToast) showToast('Enquiry deleted successfully', 'success');
                    } catch (err) {
                        console.error(err);
                        if (showToast) showToast('Failed to delete enquiry', 'error');
                    }
                }
            });
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-900">Admissions Enquiries</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {enquiries.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <p>No new enquiries found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-900 font-semibold uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Department</th>
                                    <th className="px-6 py-3">Message</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {enquiries.map((enq) => (
                                    <tr key={enq._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{new Date(enq.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {enq.name}
                                            <div className="text-xs text-gray-500 font-normal">{enq.email}</div>
                                        </td>
                                        <td className="px-6 py-4">{enq.department}</td>
                                        <td className="px-6 py-4 relative group cursor-help">
                                            <span className="truncate max-w-xs block">{enq.message || '-'}</span>
                                            {/* Tooltip for full message */}
                                            {enq.message && (
                                                <div className="absolute hidden group-hover:block z-10 bg-black text-white p-2 rounded text-xs w-64 -top-8 left-0 shadow-lg">
                                                    {enq.message}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${enq.status === 'New' ? 'bg-blue-100 text-blue-700' :
                                                enq.status === 'Contacted' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {enq.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            {enq.status === 'New' && (
                                                <button onClick={() => updateStatus(enq._id, 'Contacted')} className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100 border border-green-200">
                                                    Mark Contacted
                                                </button>
                                            )}
                                            <button onClick={() => deleteEnquiry(enq._id)} className="text-red-400 hover:text-red-600">
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminEnquiries;

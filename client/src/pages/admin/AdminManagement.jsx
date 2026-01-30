import React from 'react';
import { FaPlus } from 'react-icons/fa';
import DataTable from '../../components/admin/DataTable';

const AdminManagement = ({
    activeSection,
    data,
    columns,
    onOpenModal,
    onDelete,
    onEdit
}) => {

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Management</h2>
                <button
                    onClick={() => onOpenModal(activeSection)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm font-medium transition-colors text-sm"
                >
                    <FaPlus /> Add {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                </button>
            </div>
            <DataTable
                columns={columns}
                data={data}
                onDelete={(idx) => onDelete(activeSection, idx)}
                onEdit={(item) => onEdit(activeSection, item)}
            />
        </div>
    );
};

export default AdminManagement;

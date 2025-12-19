import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const DataTable = ({ columns, data, onEdit, onDelete, actions = true }) => {
    return (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            S.No
                        </th>
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                            >
                                {col.header}
                            </th>
                        ))}
                        {actions && (
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length + (actions ? 2 : 1)}
                                className="px-6 py-12 text-center text-gray-400 text-sm"
                            >
                                No data available. Add a new entry to get started.
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIdx) => (
                            <tr
                                key={rowIdx}
                                className="hover:bg-gray-50 transition-colors duration-150"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                    {/* S.No is strictly Row Index + 1 for visual consistency */}
                                    {rowIdx + 1}
                                </td>

                                {columns.map((col, colIdx) => (
                                    <td key={colIdx} className={`px-6 py-4 text-sm text-gray-700 ${col.className || 'whitespace-nowrap'}`}>
                                        {/* Render custom cell if accessor is a function, else direct property */}
                                        {typeof col.accessor === 'function'
                                            ? col.accessor(row)
                                            : row[col.accessor]}
                                    </td>
                                ))}

                                {actions && (
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-3">
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(row)}
                                                    className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit size={14} />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(rowIdx)}
                                                    className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;

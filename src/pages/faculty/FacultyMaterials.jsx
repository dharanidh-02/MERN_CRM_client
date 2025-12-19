import React, { useState, useEffect } from 'react';
import { FaCloudUploadAlt, FaTimes, FaFilePdf, FaFileWord, FaFilePowerpoint, FaTrash } from 'react-icons/fa';

const Input = ({ label, name, type = "text", value, onChange, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder={placeholder}
        />
    </div>
);

const FacultyMaterials = ({ facultyData, materials, setMaterials }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        lesson: '',
        subTopic: '',
        course: facultyData?.course?.name || facultyData?.course || '',
        file: null
    });

    // Update default course if faculty data loads late
    useEffect(() => {
        const courseName = facultyData?.course?.name || facultyData?.course;
        if (courseName && !uploadForm.course) {
            setUploadForm(prev => ({ ...prev, course: courseName }));
        }
    }, [facultyData]);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setUploadForm({ ...uploadForm, file: e.target.files[0] });
        }
    };

    const handleUpload = (e) => {
        e.preventDefault();
        if (!uploadForm.lesson || !uploadForm.subTopic || !uploadForm.course || !uploadForm.file) return;

        const newDoc = {
            id: Date.now(),
            lesson: uploadForm.lesson,
            subTopic: uploadForm.subTopic,
            course: uploadForm.course,
            type: uploadForm.file.name.split('.').pop() || 'file',
            size: (uploadForm.file.size / 1024 / 1024).toFixed(1) + ' MB',
            date: new Date().toISOString().split('T')[0]
        };

        setMaterials([newDoc, ...materials]);
        setUploadForm({ ...uploadForm, lesson: '', subTopic: '', file: null }); // Keep course
        setIsModalOpen(false);
        alert("Material Uploaded Successfully!");
    };

    const deleteMaterial = (id) => {
        if (window.confirm('Are you sure you want to remove this material?')) {
            setMaterials(materials.filter(m => m.id !== id));
        }
    }

    const getIcon = (type) => {
        if (type.includes('pdf')) return <FaFilePdf className="text-red-500 text-3xl" />;
        if (type.includes('doc')) return <FaFileWord className="text-blue-500 text-3xl" />;
        if (type.includes('ppt')) return <FaFilePowerpoint className="text-orange-500 text-3xl" />;
        return <FaFilePdf className="text-gray-500 text-3xl" />;
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Study Materials</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
                >
                    <FaCloudUploadAlt /> Upload Material
                </button>
            </div>

            {/* Upload Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden animate-fade-in-up">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">Upload New Material</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleUpload} className="space-y-4">
                                <Input
                                    label="Lesson Name / Unit"
                                    name="lesson"
                                    placeholder="e.g., Unit 1"
                                    value={uploadForm.lesson}
                                    onChange={(n, v) => setUploadForm({ ...uploadForm, lesson: v })}
                                />
                                <Input
                                    label="Sub-topic Name"
                                    name="subTopic"
                                    placeholder="e.g., Intro to Algorithms"
                                    value={uploadForm.subTopic}
                                    onChange={(n, v) => setUploadForm({ ...uploadForm, subTopic: v })}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                                    <select
                                        value={uploadForm.course}
                                        onChange={(e) => setUploadForm({ ...uploadForm, course: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
                                    >
                                        <option value="">Select Course</option>
                                        {Array.isArray(facultyData?.course) ? (
                                            facultyData.course.map((c, i) => {
                                                const cName = c.name || c;
                                                return <option key={i} value={cName}>{cName}</option>;
                                            })
                                        ) : (
                                            <option value={facultyData?.course?.name || facultyData?.course}>
                                                {facultyData?.course?.name || facultyData?.course}
                                            </option>
                                        )}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                                    <div className="flex gap-2">
                                        <label className="flex-1 cursor-pointer bg-white border border-dashed border-gray-300 text-gray-500 rounded-lg px-4 py-8 hover:bg-gray-50 flex flex-col items-center gap-2 justify-center">
                                            <FaCloudUploadAlt size={24} className="text-gray-400" />
                                            <span className="text-sm">{uploadForm.file ? uploadForm.file.name : 'Click to Browse File'}</span>
                                            <input type="file" className="hidden" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!uploadForm.lesson || !uploadForm.subTopic || !uploadForm.file}
                                        className="bg-green-600 text-white py-2 px-6 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Upload
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Materials Grid */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Uploaded Materials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {materials.map((item) => (
                        <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group flex flex-col justify-between h-48">
                            <div className="flex items-start justify-between">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    {getIcon(item.type)}
                                </div>
                                <button
                                    onClick={() => deleteMaterial(item.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                    title="Delete Material"
                                >
                                    <FaTrash size={14} />
                                </button>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 line-clamp-1 mb-1">{item.subTopic}</h4>
                                <p className="text-sm font-medium text-blue-600">{item.lesson}</p>
                                <p className="text-xs text-gray-500 mt-1">{item.course}</p>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-50 pt-3">
                                <span>{item.date}</span>
                                <span>{item.size}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FacultyMaterials;

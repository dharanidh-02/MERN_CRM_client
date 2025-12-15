import React, { useState } from 'react';
import axios from 'axios';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import PremiumButton from '../../components/common/PremiumButton';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaUser, FaEnvelope, FaPhone, FaBuilding, FaCheckCircle } from 'react-icons/fa';
import Silk from '../Silk/Silk';

const InputField = ({ label, type, name, value, onChange, placeholder, icon }) => (
    <div className="mb-6 relative group">
        <label className="block text-blue-300 text-sm font-bold mb-2 ml-1">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-500/50 group-focus-within:text-blue-400 transition-colors">
                {icon}
            </div>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full bg-white/5 border-b border-white/20 text-white pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300 rounded-t-lg placeholder-gray-500"
                placeholder={placeholder}
                required
            />
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 origin-center" />
        </div>
    </div>
);

const SelectField = ({ label, name, value, onChange, options, icon }) => (
    <div className="mb-6 relative group">
        <label className="block text-blue-300 text-sm font-bold mb-2 ml-1">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-500/50 group-focus-within:text-blue-400 transition-colors">
                {icon}
            </div>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full bg-[#0a1128] border-b border-white/20 text-white pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 transition-all duration-300 rounded-t-lg appearance-none cursor-pointer"
                required
            >
                <option value="" disabled className="text-gray-500">Select an option</option>
                {options.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#020617] text-white py-2">{opt}</option>
                ))}
            </select>
        </div>
    </div>
);

const EnquiryPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        department: '',
        message: ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:5000/enquiry/create', formData);

            // Simulating network delay for effect (or just show success)
            setTimeout(() => {
                setIsSubmitted(true);
                setFormData({ name: '', email: '', phone: '', department: '', message: '' });
            }, 800);

        } catch (error) {
            console.error("Error submitting enquiry:", error);
            alert("Failed to submit enquiry. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans bg-[#020617] overflow-x-hidden selection:bg-blue-500/30">
            <Header />

            <main className="flex-grow relative pt-32 pb-20 flex items-center justify-center">
                {/* Background Animation */}
                <div className="absolute inset-0 z-0 h-full w-full opacity-60 pointer-events-none fixed">
                    <Silk
                        color="#3b82f6"
                        speed={1.0}
                        scale={6}
                        noiseIntensity={0.1}
                    />
                </div>

                {/* Content Container */}
                <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col md:flex-row gap-8 items-stretch">

                    {/* Left: Text Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 flex flex-col justify-center text-left"
                    >
                        <h1 className="text-5xl font-black text-white mb-6 leading-tight">
                            Start Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 text-glow">
                                Journey
                            </span>
                        </h1>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            Have questions about admissions, courses, or campus life?
                            Fill out the form and our team will get back to you with lightning speed.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <FaPhone />
                                </div>
                                <div>
                                    <p className="text-xs text-blue-300 uppercase tracking-widest font-bold">Call Us</p>
                                    <p className="text-white font-medium">+91 98765 43210</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                                    <FaEnvelope />
                                </div>
                                <div>
                                    <p className="text-xs text-blue-300 uppercase tracking-widest font-bold">Email Us</p>
                                    <p className="text-white font-medium">admissions@collegecrm.edu</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Form Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex-1"
                    >
                        <div className="bg-[#0f172a]/60 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.15)] relative overflow-hidden group">

                            {/* Decorative Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-all duration-500"></div>

                            {!isSubmitted ? (
                                <form onSubmit={handleSubmit} className="relative z-10">
                                    <h2 className="text-2xl font-bold text-white mb-6">Enquiry Form</h2>

                                    <InputField
                                        label="Full Name"
                                        type="text"
                                        name="name"
                                        icon={<FaUser />}
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField
                                            label="Email Address"
                                            type="email"
                                            name="email"
                                            icon={<FaEnvelope />}
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                        />
                                        <InputField
                                            label="Phone Number"
                                            type="tel"
                                            name="phone"
                                            icon={<FaPhone />}
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+91..."
                                        />
                                    </div>

                                    <SelectField
                                        label="Interested Department"
                                        name="department"
                                        icon={<FaBuilding />}
                                        value={formData.department}
                                        onChange={handleChange}
                                        options={['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Business Administration']}
                                    />

                                    <div className="mb-8 relative">
                                        <label className="block text-blue-300 text-sm font-bold mb-2 ml-1">Message (Optional)</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border-b border-white/20 text-white px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300 rounded-t-lg h-24 resize-none"
                                            placeholder="Tell us about your academic goals..."
                                        />
                                        <div className="absolute inset-x-0 bottom-[6px] h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 origin-center" />
                                    </div>

                                    <PremiumButton variant="primary" className="w-full shadow-lg hover:!shadow-blue-500/40">
                                        Submit Enquiry <FaPaperPlane className="ml-2 text-sm" />
                                    </PremiumButton>

                                </form>
                            ) : (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="h-full min-h-[400px] flex flex-col items-center justify-center text-center relative z-10"
                                >
                                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                                        <FaCheckCircle className="text-4xl text-green-400" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-2">Enquiry Sent!</h3>
                                    <p className="text-gray-400 mb-8 max-w-xs">
                                        Thank you for your interest. Our admissions team will contact you shortly.
                                    </p>
                                    <PremiumButton variant="outline" onClick={() => setIsSubmitted(false)}>
                                        Send Another
                                    </PremiumButton>
                                </motion.div>
                            )}

                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default EnquiryPage;

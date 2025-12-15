import React from 'react';
import { FaTwitter, FaLinkedin, FaGithub, FaInstagram, FaHeart } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-[#020617] text-gray-400 font-sans border-t border-white/5 relative overflow-hidden pt-20 pb-10">
            {/* Glow effect */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-3xl font-bold mb-6 text-white tracking-wide">CollegeCRM</h2>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-sm mb-8">
                            The future of academic management is here. Built for speed, designed for elegance.
                        </p>
                        <div className="flex gap-4">
                            {[FaTwitter, FaLinkedin, FaGithub, FaInstagram].map((Icon, idx) => (
                                <a key={idx} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300">
                                    <Icon />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white">Platform</h3>
                        <ul className="space-y-4">
                            {['Features', 'Pricing', 'Testimonials', 'Integration'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="hover:text-blue-400 transition-colors duration-200 block">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white">Legal</h3>
                        <ul className="space-y-4">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="hover:text-cyan-400 transition-colors duration-200 block">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium">
                    <p>&copy; {new Date().getFullYear()} CollegeCRM Inc. All rights reserved.</p>
                    <p className="flex items-center gap-2">
                        Made with <FaHeart className="text-blue-500 animate-pulse" /> for Education
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

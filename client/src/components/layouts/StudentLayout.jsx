 import React from 'react';
import { Outlet } from 'react-router-dom';
import PillNav from '../../pages/PillNav/PillNav';
import { FaGraduationCap } from 'react-icons/fa';

const StudentLayout = () => {
    // Logo for the PillNav (using text as logo for now or a placeholder icon)
    // In a real app, you'd import an SVG
    const logoUrl = "https://cdn-icons-png.flaticon.com/512/2995/2995620.png"; // Placeholder graduation cap

    const navItems = [
        { label: 'Dashboard', href: '/student/dashboard' },
        { label: 'My Attendance', href: '/student/attendance' },
        { label: 'My Marks', href: '/student/marks' },
        { label: 'Study Materials', href: '/student/materials' },
        { label: 'Profile', href: '/student/profile' },
        { label: 'Logout', href: '/' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
            {/* Top Navigation using PillNav */}
            <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 pointer-events-none">
                <div className="pointer-events-auto">
                    <PillNav
                        logo={logoUrl}
                        logoAlt="Student Portal"
                        items={navItems}
                        activeHref={window.location.pathname}
                        baseColor="#1e293b" // Slate-800
                        pillColor="#ffffff"
                        hoveredPillTextColor="#ffffff"
                        pillTextColor="#1e293b"
                        className="shadow-xl shadow-slate-200/50"
                    />
                </div>
            </header>

            {/* Main Content Area */}
            <main className="pt-24 px-4 pb-12 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
                <Outlet />
            </main>

            {/* Simple Footer */}
            <footer className="py-6 text-center text-slate-400 text-sm border-t border-gray-200 mt-12">
                <p>&copy; 2024 College CRM. Student Portal.</p>
            </footer>
        </div>
    );
};

export default StudentLayout;

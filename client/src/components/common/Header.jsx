import React from 'react'
import { Link } from 'react-router-dom'
import { FaBolt } from 'react-icons/fa'
import PremiumButton from './PremiumButton'

const Header = () => {
    return (
        <div className="relative z-50">
            <header className="fixed top-0 w-full font-sans flex justify-between items-center bg-[#020617]/50 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12 transition-all duration-300">
                {/* Logo Section */}
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center text-white text-lg shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300">
                        <FaBolt />
                    </div>
                    <span className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                        College<span className="text-white">CRM</span>
                    </span>
                </div>

                {/* Navigation Links */}
                <ul className="hidden md:flex gap-x-8 font-medium items-center text-gray-300">
                    {['Home', 'Enquiry', 'About'].map((item) => (
                        <li key={item} className="relative group">
                            <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="hover:text-white transition-colors duration-300">
                                {item}
                            </Link>
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 group-hover:w-full"></span>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-4">
                    <Link to="/login">
                        <PremiumButton variant="primary" className="scale-90 px-6 py-2 !rounded-full">
                            Login
                        </PremiumButton>
                    </Link>
                </div>
            </header>
        </div>
    )
}

export default Header

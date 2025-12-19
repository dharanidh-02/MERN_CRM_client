import React from 'react';

const PremiumButton = ({ children, onClick, variant = 'primary', className = '' }) => {
    const baseStyle = "relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-bold tracking-wider text-white rounded-lg group transition-all duration-300";

    const variants = {
        primary: "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-transparent hover:shadow-[0_0_35px_rgba(59,130,246,0.7)] transform hover:-translate-y-1",
        secondary: "bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md text-white shadow-lg hover:shadow-cyan-500/20",
        outline: "bg-transparent border border-blue-500/50 text-blue-300 hover:border-blue-400 hover:text-white hover:bg-blue-500/10 box-border"
    };

    return (
        <button className={`${baseStyle} ${variants[variant]} ${className}`} onClick={onClick}>
            {variant === 'primary' && (
                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-72 group-hover:h-72 opacity-10"></span>
            )}
            <span className="relative flex items-center gap-2">{children}</span>
        </button>
    );
};

export default PremiumButton;

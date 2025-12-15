/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#020617", // Slate 950 (Deep Blue/Black)
                primary: "#3b82f6",    // Blue 500
                secondary: "#0ea5e9",  // Sky 500
                accent: "#06b6d4",     // Cyan 500
                "glass-border": "rgba(255, 255, 255, 0.08)",
            },
            animation: {
                'blob': 'blob 7s infinite',
                'shimmer': 'shimmer 2s linear infinite',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                shimmer: {
                    from: { backgroundPosition: '0 0' },
                    to: { backgroundPosition: '-200% 0' },
                },
            },
        },
    },
    plugins: [],
}

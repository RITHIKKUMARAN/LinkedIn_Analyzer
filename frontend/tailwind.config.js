/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0a0a0a",
                surface: "#1a1a1a",
                primary: "#3b82f6",
                secondary: "#8b5cf6",
                accent: "#10b981",
                "glass-border": "rgba(255, 255, 255, 0.1)",
                "glass-bg": "rgba(255, 255, 255, 0.05)",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Space Grotesk', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 180deg, #e92a67 360deg)',
            }
        },
    },
    plugins: [],
}

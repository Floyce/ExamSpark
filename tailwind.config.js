/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                pink: {
                    50: '#fff1f2',
                    100: '#ffe4e6', // Matches --pink-100
                    200: '#fecdd3',
                    300: '#fda4af',
                    400: '#fb7185',
                    500: '#f43f5e',
                    600: '#e11d48',
                    700: '#be123c',
                },
                purple: {
                    100: '#f3e8ff', // Matches --purple-100
                    500: '#a855f7',
                    700: '#7e22ce',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}

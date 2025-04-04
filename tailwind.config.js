/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '128': '32rem', // Thêm kích thước tùy chỉnh
        '144': '36rem',
      },
      maxWidth: {
        'custom': '1200px', // Giới hạn chiều rộng tùy chỉnh
      },
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A1068',
          light:   '#7B3FA0',
          dark:    '#2D0845',
          50:      '#F8F0FF',
          100:     '#EDD6FF',
          200:     '#D9ADFF',
        },
        rose: {
          DEFAULT: '#C9963C',
          light:   '#E8B86D',
          soft:    '#FDF3E3',
          blush:   '#F9E8C8',
        },
        gold: {
          DEFAULT: '#C9963C',
          light:   '#E8C06A',
          pale:    '#FBF0D5',
          shine:   '#F5D98A',
        },
        champagne: {
          DEFAULT: '#F5E6C8',
          dark:    '#D4AF7A',
          light:   '#FBF5EE',
        },
        ivory: {
          DEFAULT: '#FDF8F0',
          warm:    '#FAF0E0',
        },
        plum: {
          DEFAULT: '#2D0845',
          light:   '#4A1068',
          pale:    '#EDD6FF',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        accent:  ['"Cormorant Garamond"', 'serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg,#2D0845 0%,#4A1068 50%,#7B3FA0 100%)',
        'dark-brand':     'linear-gradient(135deg,#1A0330 0%,#2D0845 50%,#4A1068 100%)',
        'gold-gradient':  'linear-gradient(135deg,#A87420,#E8C06A,#C9963C)',
        'hero-overlay':   'linear-gradient(to right,rgba(45,8,69,0.92) 0%,rgba(45,8,69,0.5) 60%,transparent 100%)',
      },
      boxShadow: {
        'card':    '0 4px 20px rgba(74,16,104,0.12)',
        'hover':   '0 12px 40px rgba(74,16,104,0.25)',
        'gold':    '0 4px 20px rgba(201,150,60,0.30)',
        'premium': '0 20px 60px rgba(45,8,69,0.35)',
        'glass':   '0 8px 32px rgba(74,16,104,0.15)',
      },
      animation: {
        'float':   'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 1.8s infinite linear',
        'fade-up': 'fadeUp 0.5s ease-out',
        'marquee': 'marquee 30s linear infinite',
        'glow':    'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float:   { '0%,100%':{ transform:'translateY(0)' },     '50%':{ transform:'translateY(-12px)' } },
        shimmer: { '0%':{ backgroundPosition:'-200% 0' },        '100%':{ backgroundPosition:'200% 0' } },
        fadeUp:  { '0%':{ opacity:0,transform:'translateY(16px)'},'100%':{ opacity:1,transform:'translateY(0)' } },
        marquee: { '0%':{ transform:'translateX(0)' },            '100%':{ transform:'translateX(-50%)' } },
        glow:    { '0%,100%':{ boxShadow:'0 0 0 rgba(201,150,60,0)' },'50%':{ boxShadow:'0 0 30px rgba(201,150,60,0.5)' } },
      },
    },
  },
  plugins: [],
};

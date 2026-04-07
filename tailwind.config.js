export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'bounce-slow':   'bounce 1.5s infinite',
        'float-up':      'floatUp 0.8s ease-out forwards',
        'pop-in':        'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'shimmer':       'shimmer 2s infinite',
        'balloon-rise':  'balloonRise 6s ease-in infinite',
        'twinkle':       'twinkle 1.5s ease-in-out infinite',
      },
      keyframes: {
        floatUp: {
          '0%':   { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-150px) scale(0.8)' },
        },
        popIn: {
          '0%':   { transform: 'scale(0)' },
          '80%':  { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0.6' },
        },
        balloonRise: {
          '0%':   { transform: 'translateY(100vh) rotate(-5deg)', opacity: '1' },
          '100%': { transform: 'translateY(-100px) rotate(5deg)', opacity: '0' },
        },
        twinkle: {
          '0%,100%': { transform: 'scale(1)',   opacity: '1'   },
          '50%':     { transform: 'scale(1.3)', opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}

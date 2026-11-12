/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // All colours come from CSS variables in src/index.css, so light and dark themes share one set of classes.
        ink: 'var(--fg)',
        paper: 'var(--bg)',
        accent: 'var(--accent)',
        'on-accent': 'var(--on-accent)',
        frame: 'var(--frame)',
        'on-frame': 'var(--on-frame)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        danger: 'var(--danger)',
        control: 'var(--control)',
        'skin-soft': 'var(--skin-soft)',
        skin: 'var(--skin)',
      },
      fontFamily: { sans: ['var(--font-body)'], display: ['var(--font-display)'] },
      borderRadius: { box: 'var(--radius)', panel: 'var(--radius-lg)', btn: 'var(--radius-btn)', input: 'var(--radius-sm)' },
      maxWidth: { site: '80rem' }, // 1280px
      fontSize: { base: ['16px', '26px'] }, // body text size, used globally
    },
  },
  plugins: [],
};
